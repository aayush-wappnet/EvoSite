import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { InvoiceStatus } from '../../common/enums/invoice-status.enum';

export class UpdateInvoiceDto {
  @ApiProperty({ enum: InvoiceStatus, example: InvoiceStatus.APPROVED })
  @IsNotEmpty()
  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;
}