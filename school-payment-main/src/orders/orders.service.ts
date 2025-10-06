import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as jwt from 'jsonwebtoken';
import { Order } from '../schemas/order.schema';
import { OrderStatus } from '../schemas/order-status.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatus>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    try {
      const { school_id, trustee_id, amount, student_info, gateway_name, callback_url } = createPaymentDto;

      // Generate custom order ID
      const custom_order_id = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Prepare payment API request FIRST (before creating order)
      const paymentApiUrl = this.configService.get('PAYMENT_API_URL');
      const apiKey = this.configService.get('PAYMENT_API_KEY');
      const pgKey = this.configService.get('PG_KEY');
      
      const callbackUrl = callback_url || `${this.configService.get('FRONTEND_URL')}/payment-callback`;

      // Create JWT sign for payment API
      const signPayload = {
        school_id,
        amount: amount.toString(),
        callback_url: callbackUrl,
      };

      const sign = jwt.sign(signPayload, pgKey);

      // Call payment API
      const paymentRequestBody = {
        school_id,
        amount: amount.toString(),
        callback_url: callbackUrl,
        sign,
      };

      this.logger.log('Payment API Request:', JSON.stringify(paymentRequestBody, null, 2));

      const response = await firstValueFrom(
        this.httpService.post(
          `${paymentApiUrl}/create-collect-request`,
          paymentRequestBody,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
          },
        ),
      );

      this.logger.log('Payment API Full Response:', JSON.stringify(response.data, null, 2));

      // Extract data from response
      const collectRequestId = response.data.collect_request_id;
      const paymentUrl = response.data.collect_request_url || response.data.Collect_request_url;

      if (!collectRequestId) {
        throw new InternalServerErrorException('collect_request_id not received from payment API');
      }

      if (!paymentUrl) {
        this.logger.warn('Payment URL not received in API response. Response data:', response.data);
      }

      // NOW create order with the collect_id we got from API
      const order = await this.orderModel.create({
        school_id,
        trustee_id,
        student_info,
        gateway_name,
        custom_order_id,
        collect_id: collectRequestId,  // ✅ Set it immediately with string value
      });

      // Create order status with the SAME collect_id (string)
      await this.orderStatusModel.create({
        collect_id: collectRequestId,  // ✅ Use the string collect_id from API
        order_amount: amount,
        transaction_amount: amount,
        status: 'pending',
      });

      this.logger.log(`Order created with collect_id: ${collectRequestId}`);

      return {
        success: true,
        message: 'Payment link generated successfully',
        data: {
          custom_order_id,
          collect_request_id: collectRequestId,
          payment_url: paymentUrl || null,
          order_id: order._id,
          raw_response: response.data,
        },
      };
    } catch (error) {
      this.logger.error('Payment creation error:', error.response?.data || error.message);
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Failed to create payment',
      );
    }
  }

  async getOrderByCustomId(customOrderId: string) {
    const order = await this.orderModel.findOne({ custom_order_id: customOrderId });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return order;
  }
}