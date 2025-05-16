import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({ example: 'ABC Supplies' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'John Smith' })
  @IsNotEmpty()
  @IsString()
  contactName: string;

  @ApiProperty({ example: 'john@abcsupplies.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsNotEmpty()
  @IsString()
  phone: string;
}