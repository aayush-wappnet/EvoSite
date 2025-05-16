import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../../common/enums/document-type.enum';

export class DocumentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  version: string;

  @ApiProperty({ enum: DocumentType })
  type: DocumentType;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}