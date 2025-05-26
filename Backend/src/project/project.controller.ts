import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { AssignUserDto } from './dto/assign-user.dto';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully', type: ProjectResponseDto })
  async create(@Body() createProjectDto: CreateProjectDto): Promise<ProjectResponseDto> {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects as per user role' })
  @ApiResponse({ status: 200, description: 'Return all projects', type: [ProjectResponseDto] })
  async findAll(@Request() req): Promise<ProjectResponseDto[]> {
    return this.projectService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Return the project', type: ProjectResponseDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.projectService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully', type: ProjectResponseDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.projectService.remove(id);
    return { message: 'Project deleted successfully' };
  }

  @Post(':id/users')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Assign a user to a project' })
  @ApiResponse({ status: 200, description: 'User assigned successfully', type: ProjectResponseDto })
  async assignUser(
    @Param('id') id: string,
    @Body() assignUserDto: AssignUserDto,
  ): Promise<ProjectResponseDto> {
    return this.projectService.assignUser(id, assignUserDto.userId);
  }

  @Delete(':id/users/:userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remove a user from a project' })
  @ApiResponse({ status: 200, description: 'User removed successfully', type: ProjectResponseDto })
  async removeUser(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<ProjectResponseDto> {
    return this.projectService.removeUser(id, userId);
  }
}