import { ApiProperty } from '@nestjs/swagger';

class VendorBasicDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

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
  siteId: string;

  @ApiProperty({ type: VendorBasicDto })
  vendor: VendorBasicDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}