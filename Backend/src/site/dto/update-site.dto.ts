import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSiteDto {
  @ApiProperty({ example: 'Downtown Site', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '123 Main St, City, Country', required: false })
  @IsOptional()
  @IsString()
  location?: string;
}