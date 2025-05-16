import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private userService: UserService,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['users', 'sites'],
    });
    
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }

  async assignUser(projectId: string, userId: string): Promise<Project> {
    const project = await this.findOne(projectId);
    const user = await this.userService.findOne(userId);
    
    if (!project.users) {
      project.users = [];
    }
    
    // Check if user is already assigned
    const isUserAssigned = project.users.some(u => u.id === userId);
    if (!isUserAssigned) {
      project.users.push(user);
      await this.projectRepository.save(project);
    }
    
    return project;
  }

  async removeUser(projectId: string, userId: string): Promise<Project> {
    const project = await this.findOne(projectId);
    
    if (project.users) {
      project.users = project.users.filter(user => user.id !== userId);
      await this.projectRepository.save(project);
    }
    
    return project;
  }
}