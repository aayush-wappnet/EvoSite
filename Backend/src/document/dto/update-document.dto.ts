import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDocumentDto {
  @ApiProperty({ example: 'Building Blueprint v2', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file?: Express.Multer.File;

  @ApiProperty({ example: '2.0', required: false })
  @IsOptional()
  @IsString()
  version?: string;
}