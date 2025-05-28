import { ApiProperty } from '@nestjs/swagger';
import { MaterialStatus } from '../../common/enums/material-status.enum';

export class MaterialResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  vendorId: string;

  @ApiProperty()
  siteId: string;

  @ApiProperty({ enum: MaterialStatus })
  status: MaterialStatus;

  @ApiProperty()
  requestedById: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  vendor: {
    id: string;
    name: string;
  };

  @ApiProperty()
  site: {
    id: string;
    name: string;
  };

  @ApiProperty()
  requestedBy: {
    id: string;
    name: string;
  };
}