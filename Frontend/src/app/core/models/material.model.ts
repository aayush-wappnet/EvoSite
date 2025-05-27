import { Vendor } from './vendor.model';
import { Site } from './site.model';
import { InvoiceItem } from './invoice.model';

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  siteId: string;
  vendor: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMaterial {
  name: string;
  quantity: number;
  unit: string;
  vendorId: string;
  siteId: string;
}

export interface UpdateMaterial {
  quantity?: number;
} 