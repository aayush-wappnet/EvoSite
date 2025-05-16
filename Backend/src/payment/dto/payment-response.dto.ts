import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../../common/enums/payment-status.enum';

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  invoiceId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  date: Date;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}