import { ProjectStatus } from '../constants/project-status.enum';
import { User } from './user.model';
import { Site } from './site.model';
import { Task } from './task.model';
import { Document } from './document.model';
import { Invoice } from './invoice.model';
import { AssignUserDto } from './shared.dto';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  users?: User[];
  sites?: Site[];
  tasks?: Task[];
  documents?: Document[];
  invoices?: Invoice[];
}

export interface CreateProjectDto {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: ProjectStatus;
}

export type { AssignUserDto }; 