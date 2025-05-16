import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateVendorDto {
  @ApiProperty({ example: 'ABC Supplies', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'John Smith', required: false })
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiProperty({ example: 'john@abcsupplies.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}