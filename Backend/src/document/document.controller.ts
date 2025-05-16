import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentResponseDto } from './dto/document-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Documents')
@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SITE_ENGINEER, Role.CONTRACTOR)
  @ApiOperation({ summary: 'Create a new document' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Document created successfully', type: DocumentResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<DocumentResponseDto> {
    return this.documentService.create(createDocumentDto, file, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: 200, description: 'Return all documents', type: [DocumentResponseDto] })
  async findAll(): Promise<DocumentResponseDto[]> {
    return this.documentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a document by ID' })
  @ApiResponse({ status: 200, description: 'Return the document', type: DocumentResponseDto })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async findOne(@Param('id') id: string): Promise<DocumentResponseDto> {
    return this.documentService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Update a document' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Document updated successfully', type: DocumentResponseDto })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<DocumentResponseDto> {
    return this.documentService.update(id, updateDocumentDto, file);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.documentService.remove(id);
    return { message: 'Document deleted successfully' };
  }
}