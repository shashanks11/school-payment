import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Order } from '../schemas/order.schema';
import { OrderStatus } from '../schemas/order-status.schema';
import { TransactionQueryDto } from './dto/query.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatus>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getAllTransactions(queryDto: TransactionQueryDto) {
    const {
      page = 1,
      limit = 10,
      status,
      school_id,
      sort = 'createdAt',
      order = 'desc',
      search,
      start_date,
      end_date,
    } = queryDto;

    const skip = (page - 1) * limit;

    // Build match stage for filtering
    const matchStage: any = {};

    if (status) {
      matchStage['orderStatus.status'] = status;
    }

    if (school_id) {
      matchStage.school_id = school_id;
    }

    if (search) {
      matchStage.$or = [
        { custom_order_id: { $regex: search, $options: 'i' } },
        { collect_id: { $regex: search, $options: 'i' } },
        { 'student_info.name': { $regex: search, $options: 'i' } },
        { 'student_info.email': { $regex: search, $options: 'i' } },
      ];
    }

    if (start_date || end_date) {
      matchStage['orderStatus.payment_time'] = {};
      if (start_date) {
        matchStage['orderStatus.payment_time'].$gte = new Date(start_date);
      }
      if (end_date) {
        matchStage['orderStatus.payment_time'].$lte = new Date(end_date);
      }
    }

    // Build sort stage
    const sortStage: any = {};
    sortStage[sort === 'payment_time' ? 'orderStatus.payment_time' : sort] = 
      order === 'asc' ? 1 : -1;

    // Aggregation pipeline
    const pipeline: any[] = [
      {
        $lookup: {
          from: 'orderstatuses', // MongoDB collection name (plural, lowercase)
          localField: 'collect_id',
          foreignField: 'collect_id',
          as: 'orderStatus',
        },
      },
      {
        $unwind: {
          path: '$orderStatus',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    // Add match stage if filters exist
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Add sort
    pipeline.push({ $sort: sortStage });

    // Get total count
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await this.orderModel.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: limit });

    // Project fields
    pipeline.push({
      $project: {
        _id: 1,
        collect_id: 1,
        school_id: 1,
        custom_order_id: 1,
        gateway_name: '$gateway_name',
        student_info: 1,
        order_amount: '$orderStatus.order_amount',
        transaction_amount: '$orderStatus.transaction_amount',
        status: '$orderStatus.status',
        payment_mode: '$orderStatus.payment_mode',
        payment_details: '$orderStatus.payment_details',
        bank_reference: '$orderStatus.bank_reference',
        payment_message: '$orderStatus.payment_message',
        payment_time: '$orderStatus.payment_time',
        error_message: '$orderStatus.error_message',
        createdAt: 1,
        updatedAt: 1,
      },
    });

    const transactions = await this.orderModel.aggregate(pipeline);

    return {
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionsBySchool(schoolId: string, queryDto: TransactionQueryDto) {
    return this.getAllTransactions({ ...queryDto, school_id: schoolId });
  }

  async getTransactionStatus(collectId: string) {
    const transaction = await this.orderModel.aggregate([
      {
        $match: { collect_id: collectId },
      },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: 'collect_id',
          foreignField: 'collect_id',
          as: 'orderStatus',
        },
      },
      {
        $unwind: {
          path: '$orderStatus',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          collect_id: 1,
          school_id: 1,
          custom_order_id: 1,
          gateway_name: 1,
          student_info: 1,
          order_amount: '$orderStatus.order_amount',
          transaction_amount: '$orderStatus.transaction_amount',
          status: '$orderStatus.status',
          payment_mode: '$orderStatus.payment_mode',
          payment_details: '$orderStatus.payment_details',
          bank_reference: '$orderStatus.bank_reference',
          payment_message: '$orderStatus.payment_message',
          payment_time: '$orderStatus.payment_time',
          error_message: '$orderStatus.error_message',
          createdAt: 1,
        },
      },
    ]);

    if (!transaction || transaction.length === 0) {
      throw new NotFoundException('Transaction not found');
    }

    return {
      success: true,
      data: transaction[0],
    };
  }

  async checkPaymentStatusFromAPI(collectRequestId: string) {
    try {
      const paymentApiUrl = this.configService.get('PAYMENT_API_URL');
      const apiKey = this.configService.get('PAYMENT_API_KEY');
      const pgKey = this.configService.get('PG_KEY');
      const schoolId = this.configService.get('SCHOOL_ID');

      // Create JWT sign for status check
      const signPayload = {
        school_id: schoolId,
        collect_request_id: collectRequestId,
      };

      const sign = jwt.sign(signPayload, pgKey);

      const url = `${paymentApiUrl}/collect-request/${collectRequestId}`;
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            school_id: schoolId,
            sign,
          },
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }),
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Payment status check error:', error.response?.data || error.message);
      throw new NotFoundException('Unable to fetch payment status');
    }
  }
}
