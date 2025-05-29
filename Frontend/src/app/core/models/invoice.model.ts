import { InvoiceStatus } from '../constants/invoice-status.enum';
import { User } from './user.model';
import { Project } from './project.model';
import { Task } from './task.model';
import { Material } from './material.model';
import { Payment } from './payment.model';

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  materialId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  createdAt: Date;
  invoice?: Invoice;
  material?: Material;
}

export interface Invoice {
  id: string;
  amount: number;
  status: InvoiceStatus;
  contractorId: string;
  projectId: string;
  taskId?: string;
  createdAt: Date;
  updatedAt: Date;
  contractor?: User;
  project?: Project;
  task?: Task;
  items?: InvoiceItem[];
  payments?: Payment[];
}

export interface CreateInvoiceItemDto {
  materialId: string;
  unitPrice: number;
}

export interface CreateInvoiceDto {
  projectId: string;
  taskId?: string;
  items: CreateInvoiceItemDto[];
}

export interface UpdateInvoiceDto {
  status: InvoiceStatus;
} 