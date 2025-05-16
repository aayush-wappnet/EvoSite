import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateMaterialDto {
  @ApiProperty({ example: 150, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;
}