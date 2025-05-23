import { PaymentStatus } from '../constants';
import { Invoice } from './invoice.model';

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: Date;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  invoice?: Invoice;
}

export interface CreatePaymentDto {
  invoiceId: string;
  amount: number;
  date: string;
  status: PaymentStatus;
}

export interface UpdatePaymentDto {
  status: PaymentStatus;
} 