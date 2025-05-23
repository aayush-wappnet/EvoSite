import { DocumentType } from '../constants/document-type.enum';
import { Project } from './project.model';
import { User } from './user.model';

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
  project?: Project;
  user?: User;
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