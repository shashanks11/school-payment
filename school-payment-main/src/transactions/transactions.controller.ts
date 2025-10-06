import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionQueryDto } from './dto/query.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getAllTransactions(@Query() queryDto: TransactionQueryDto) {
    return this.transactionsService.getAllTransactions(queryDto);
  }

  @Get('school/:schoolId')
  async getTransactionsBySchool(
    @Param('schoolId') schoolId: string,
    @Query() queryDto: TransactionQueryDto,
  ) {
    return this.transactionsService.getTransactionsBySchool(schoolId, queryDto);
  }

   @Get('status/:collectId')
    async getTransactionStatus(@Param('collectId') collectId: string) {
    return this.transactionsService.getTransactionStatus(collectId);
  }

  @Get('check-payment/:collectRequestId')
  async checkPaymentStatus(@Param('collectRequestId') collectRequestId: string) {
    return this.transactionsService.checkPaymentStatusFromAPI(collectRequestId);
  }
}