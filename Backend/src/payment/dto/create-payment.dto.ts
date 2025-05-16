import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { PaymentStatus } from '../../common/enums/payment-status.enum';

export class CreatePaymentDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  invoiceId: string;

  @ApiProperty({ example: 500 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: '2023-01-15' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.COMPLETED })
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}