import { IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderInfoDto {
  @IsString()
  order_id: string;

  @IsNumber()
  order_amount: number;

  @IsNumber()
  transaction_amount: number;

  @IsString()
  gateway: string;

  @IsString()
  bank_reference: string;

  @IsString()
  status: string;

  @IsString()
  payment_mode: string;

  @IsString()
  payemnt_details: string; // Note: typo in webhook (payemnt instead of payment)

  @IsString()
  Payment_message: string; // Note: capital P

  @IsString()
  payment_time: string;

  @IsString()
  error_message: string;
}

export class WebhookDto {
  @IsNumber()
  @IsNotEmpty()
  status: number;

  @ValidateNested()
  @Type(() => OrderInfoDto)
  @IsNotEmpty()
  order_info: OrderInfoDto;
}
