import { TaskStatus } from '../constants';
import { User } from './user.model';
import { Project } from './project.model';
import { Site } from './site.model';
import { AssignUserDto } from './shared.dto';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  startDate: string;
  endDate: string;
  progress: number;
  projectId: string;
  siteId: string;
  createdAt: string;
  updatedAt: string;
  project?: Project;
  site?: Site;
  users?: User[];
  dependencies?: TaskDependency[];
}

export interface CreateTaskDto {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  progress: number;
  siteId: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  progress?: number;
}

export interface TaskDependency {
  id: string;
  taskId: string;
  dependentTaskId: string;
  createdAt: string;
  dependentTask?: Task;
}

export type { AssignUserDto }; 