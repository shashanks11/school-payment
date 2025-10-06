import { IsNotEmpty, IsNumber, IsString, IsEmail, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class StudentInfoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  school_id: string;

  @IsString()
  @IsNotEmpty()
  trustee_id: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ValidateNested()
  @Type(() => StudentInfoDto)
  @IsNotEmpty()
  student_info: StudentInfoDto;

  @IsString()
  @IsNotEmpty()
  gateway_name: string;

  @IsString()
  @IsOptional()
  callback_url?: string;
}