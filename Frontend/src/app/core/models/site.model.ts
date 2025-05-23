import { Project } from './project.model';
import { Task } from './task.model';
import { Material } from './material.model';

export interface Site {
  id: string;
  name: string;
  location: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  project?: Project;
  tasks?: Task[];
  materials?: Material[];
}

export interface CreateSiteDto {
  name: string;
  location: string;
  projectId: string;
}

export interface UpdateSiteDto {
  name?: string;
  location?: string;
} 