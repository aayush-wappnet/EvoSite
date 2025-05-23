import { TaskStatus } from '../constants';
import { User } from './user.model';
import { Project } from './project.model';
import { Site } from './site.model';

export interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  startDate: Date;
  endDate: Date;
  projectId: string;
  siteId: string;
  assignedToId?: string;
  parentTaskId?: string;
  createdAt: Date;
  updatedAt: Date;
  project?: Project;
  site?: Site;
  assignedTo?: User;
  parentTask?: Task;
  subtasks?: Task[];
}

export interface CreateTaskDto {
  name: string;
  description: string;
  status: TaskStatus;
  startDate: string;
  endDate: string;
  projectId: string;
  siteId: string;
  assignedToId?: string;
  parentTaskId?: string;
}

export interface UpdateTaskDto {
  name?: string;
  description?: string;
  status?: TaskStatus;
  startDate?: string;
  endDate?: string;
  assignedToId?: string;
} 