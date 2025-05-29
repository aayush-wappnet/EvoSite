import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatus } from '../../common/enums/invoice-status.enum';

class UserBasicDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

class ProjectBasicDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

class TaskBasicDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;
}

class VendorBasicDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

class MaterialBasicDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  unit: string;

  @ApiProperty({ type: VendorBasicDto })
  vendor: VendorBasicDto;
}

class InvoiceItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: MaterialBasicDto })
  material: MaterialBasicDto;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  total: number;
}

export class InvoiceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: InvoiceStatus })
  status: InvoiceStatus;

  @ApiProperty()
  contractorId: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty({ required: false })
  taskId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [InvoiceItemResponseDto] })
  items: InvoiceItemResponseDto[];

  @ApiProperty({ type: UserBasicDto })
  contractor: UserBasicDto;

  @ApiProperty({ type: ProjectBasicDto })
  project: ProjectBasicDto;

  @ApiProperty({ type: TaskBasicDto, required: false })
  task?: TaskBasicDto;
}