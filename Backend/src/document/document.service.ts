import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private cloudinaryService: CloudinaryService,
    private projectService: ProjectService,
  ) {}

  async create(createDocumentDto: CreateDocumentDto, file: Express.Multer.File, userId: string): Promise<Document> {
    // Verify project exists
    await this.projectService.findOne(createDocumentDto.projectId);
    
    // Upload file to Cloudinary
    const url = await this.cloudinaryService.uploadFile(file, 'construction-documents');
    
    const document = this.documentRepository.create({
      ...createDocumentDto,
      url,
      userId,
    });
    
    return this.documentRepository.save(document);
  }

  async findAll(): Promise<Document[]> {
    return this.documentRepository.find();
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne({ where: { id } });
    
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    
    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto, file?: Express.Multer.File): Promise<Document> {
    const document = await this.findOne(id);
    
    // If file is provided, upload to Cloudinary and update URL
    if (file) {
      const url = await this.cloudinaryService.uploadFile(file, 'construction-documents');
      document.url = url;
    }
    
    Object.assign(document, updateDocumentDto);
    return this.documentRepository.save(document);
  }

  async remove(id: string): Promise<void> {
    const document = await this.findOne(id);
    
    // Extract public ID from Cloudinary URL
    const publicId = document.url.split('/').pop().split('.')[0];
    
    // Delete file from Cloudinary
    await this.cloudinaryService.deleteFile(publicId);
    
    await this.documentRepository.remove(document);
  }
}