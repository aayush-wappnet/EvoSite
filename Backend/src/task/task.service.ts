import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskDependency } from './entities/task-dependency.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDependencyDto } from './dto/create-task-dependency.dto';
import { SiteService } from '../site/site.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskDependency)
    private taskDependencyRepository: Repository<TaskDependency>,
    private siteService: SiteService,
    private userService: UserService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // Verify site exists
    const site = await this.siteService.findOne(createTaskDto.siteId);
    
    const task = this.taskRepository.create({
      ...createTaskDto,
      projectId: site.projectId,
    });
    
    return this.taskRepository.save(task);
  }

  async findAll(user: User): Promise<Task[]> {
    // If user is admin, return all tasks
    if (user.role === Role.ADMIN) {
      return this.taskRepository.find({
        relations: ['users', 'site', 'site.project'],
      });
    }

    // For site engineers, return only tasks they are assigned to
    if (user.role === Role.SITE_ENGINEER) {
      return this.taskRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.users', 'user')
        .leftJoinAndSelect('task.site', 'site')
        .leftJoinAndSelect('site.project', 'project')
        .where('user.id = :userId', { userId: user.id })
        .getMany();
    }

    // For other roles, return tasks from projects they are assigned to
    return this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.site', 'site')
      .leftJoinAndSelect('site.project', 'project')
      .leftJoinAndSelect('project.users', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['users', 'site', 'site.project'],
    });
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }

  async createDependency(createTaskDependencyDto: CreateTaskDependencyDto): Promise<TaskDependency> {
    // Verify both tasks exist
    await this.findOne(createTaskDependencyDto.taskId);
    await this.findOne(createTaskDependencyDto.dependentTaskId);
    
    const dependency = this.taskDependencyRepository.create(createTaskDependencyDto);
    return this.taskDependencyRepository.save(dependency);
  }

  async findDependencies(taskId: string): Promise<TaskDependency[]> {
    return this.taskDependencyRepository.find({
      where: { taskId },
    });
  }

  async assignUser(taskId: string, userId: string): Promise<Task> {
    const task = await this.findOne(taskId);
    const user = await this.userService.findOne(userId);
    
    if (!task.users) {
      task.users = [];
    }
    
    // Check if user is already assigned
    const isUserAssigned = task.users.some(u => u.id === userId);
    if (!isUserAssigned) {
      task.users.push(user);
      await this.taskRepository.save(task);
    }
    
    return task;
  }

  async removeUser(taskId: string, userId: string): Promise<Task> {
    const task = await this.findOne(taskId);
    
    if (task.users) {
      task.users = task.users.filter(user => user.id !== userId);
      await this.taskRepository.save(task);
    }
    
    return task;
  }
}