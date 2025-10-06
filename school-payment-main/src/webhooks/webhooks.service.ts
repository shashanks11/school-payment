import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../schemas/order.schema';
import { OrderStatus } from '../schemas/order-status.schema';
import { WebhookLog } from '../schemas/webhook-log.schema';
import { WebhookDto } from './dto/webhook.dto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatus>,
    @InjectModel(WebhookLog.name) private webhookLogModel: Model<WebhookLog>,
  ) {}

  async handleWebhook(webhookDto: WebhookDto, ipAddress: string) {
    try {
      const { status, order_info } = webhookDto;

      // Log webhook
      const webhookLog = await this.webhookLogModel.create({
        payload: webhookDto,
        status,
        order_id: order_info.order_id,
        processed: false,
        ip_address: ipAddress,
      });

      this.logger.log(`Webhook received for order: ${order_info.order_id}`);

      // Find order by collect_id
      const order = await this.orderModel.findOne({ 
        collect_id: order_info.order_id 
      });

      if (!order) {
        this.logger.error(`Order not found for collect_id: ${order_info.order_id}`);
        await this.webhookLogModel.findByIdAndUpdate(webhookLog._id, {
          processed: false,
          error: 'Order not found',
        });
        return {
          success: false,
          message: 'Order not found',
        };
      }

      // Find existing order status to get the original amounts
      const existingOrderStatus = await this.orderStatusModel.findOne({
        collect_id: order_info.order_id,
      });

      // Use amounts from webhook if provided, otherwise use existing amounts
      const orderAmount = order_info.order_amount || existingOrderStatus?.order_amount || 0;
      const transactionAmount = order_info.transaction_amount || existingOrderStatus?.transaction_amount || orderAmount;

      // Update order status
      const updateData = {
        order_amount: orderAmount,
        transaction_amount: transactionAmount,
        payment_mode: order_info.payment_mode,
        payment_details: order_info.payemnt_details, // Note: typo in webhook payload
        bank_reference: order_info.bank_reference,
        payment_message: order_info.Payment_message, // Note: capital P in webhook
        status: order_info.status,
        error_message: order_info.error_message,
        payment_time: new Date(order_info.payment_time),
      };

      await this.orderStatusModel.findOneAndUpdate(
        { collect_id: order_info.order_id },
        updateData,
        { new: true, upsert: true },
      );

      // Mark webhook as processed
      await this.webhookLogModel.findByIdAndUpdate(webhookLog._id, {
        processed: true,
      });

      this.logger.log(`Order status updated successfully for: ${order_info.order_id}`);

      return {
        success: true,
        message: 'Webhook processed successfully',
        data: {
          order_id: order_info.order_id,
          status: order_info.status,
        },
      };
    } catch (error) {
      this.logger.error('Webhook processing error:', error);
      throw error;
    }
  }

  async getWebhookLogs(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [logs, total] = await Promise.all([
      this.webhookLogModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.webhookLogModel.countDocuments(),
    ]);

    return {
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}