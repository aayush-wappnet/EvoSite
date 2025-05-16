import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { CreateTaskDependencyDto } from './dto/create-task-dependency.dto';
import { TaskDependencyResponseDto } from './dto/task-dependency-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { AssignUserDto } from './dto/assign-user.dto';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully', type: TaskResponseDto })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks', type: [TaskResponseDto] })
  async findAll(): Promise<TaskResponseDto[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Return the task', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: string): Promise<TaskResponseDto> {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.SITE_ENGINEER, Role.CONTRACTOR)
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.taskService.remove(id);
    return { message: 'Task deleted successfully' };
  }

  @Post('dependencies')
  @Roles(Role.ADMIN, Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Create a task dependency' })
  @ApiResponse({ status: 201, description: 'Task dependency created successfully', type: TaskDependencyResponseDto })
  async createDependency(
    @Body() createTaskDependencyDto: CreateTaskDependencyDto,
  ): Promise<TaskDependencyResponseDto> {
    return this.taskService.createDependency(createTaskDependencyDto);
  }

  @Get('dependencies/:taskId')
  @ApiOperation({ summary: 'Get task dependencies' })
  @ApiResponse({ status: 200, description: 'Return task dependencies', type: [TaskDependencyResponseDto] })
  async findDependencies(
    @Param('taskId') taskId: string,
  ): Promise<TaskDependencyResponseDto[]> {
    return this.taskService.findDependencies(taskId);
  }

  @Post(':id/users')
  @Roles(Role.ADMIN, Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Assign a user to a task' })
  @ApiResponse({ status: 200, description: 'User assigned successfully', type: TaskResponseDto })
  async assignUser(
    @Param('id') id: string,
    @Body() assignUserDto: AssignUserDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.assignUser(id, assignUserDto.userId);
  }

  @Delete(':id/users/:userId')
  @Roles(Role.ADMIN, Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Remove a user from a task' })
  @ApiResponse({ status: 200, description: 'User removed successfully', type: TaskResponseDto })
  async removeUser(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<TaskResponseDto> {
    return this.taskService.removeUser(id, userId);
  }
}