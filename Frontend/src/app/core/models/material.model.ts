import { Vendor } from './vendor.model';
import { Site } from './site.model';
import { InvoiceItem } from './invoice.model';

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  vendorId: string;
  siteId: string;
  createdAt: Date;
  updatedAt: Date;
  site?: Site;
  vendor?: Vendor;
  invoiceItems?: InvoiceItem[];
}

export interface CreateMaterialDto {
  name: string;
  quantity: number;
  unit: string;
  vendorId: string;
  siteId: string;
}

export interface UpdateMaterialDto {
  quantity?: number;
} 