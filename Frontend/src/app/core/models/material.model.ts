import { Vendor } from './vendor.model';
import { Site } from './site.model';
import { MaterialStatus } from '../constants/material-status.enum';

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  siteId: string;
  site: {
    id: string;
    name: string;
  };
  vendorId?: string;
  vendor?: {
    id: string;
    name: string;
  };
  status: MaterialStatus;
  requestedBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMaterial {
  name: string;
  quantity: number;
  unit: string;
  siteId: string;
  requestedById: string;
}

export interface UpdateMaterial {
  quantity?: number;
}

export interface OrderMaterial {
  vendorId: string;
} 