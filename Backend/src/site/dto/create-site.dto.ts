import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSiteDto {
  @ApiProperty({ example: 'Downtown Site' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '123 Main St, City, Country' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  projectId: string;
}