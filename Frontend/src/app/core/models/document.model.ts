import { DocumentType } from '../constants/document-type.enum';

export interface Document {
  id: string;
  name: string;
  url: string;
  version: string;
  type: DocumentType;
  projectId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentDto {
  name: string;
  file: File;
  version: string;
  type: DocumentType;
  projectId: string;
}

export interface UpdateDocumentDto {
  name?: string;
  file?: File;
  version?: string;
} 