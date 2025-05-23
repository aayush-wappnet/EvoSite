import { Material } from './material.model';

export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVendorDto {
  name: string;
  contactName: string;
  email: string;
  phone: string;
}

export interface UpdateVendorDto {
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
} 