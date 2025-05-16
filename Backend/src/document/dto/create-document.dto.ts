import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { DocumentType } from '../../common/enums/document-type.enum';

export class CreateDocumentDto {
  @ApiProperty({ example: 'Building Blueprint v1' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @ApiProperty({ example: '1.0' })
  @IsNotEmpty()
  @IsString()
  version: string;

  @ApiProperty({ enum: DocumentType, example: DocumentType.BLUEPRINT })
  @IsNotEmpty()
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  projectId: string;
}