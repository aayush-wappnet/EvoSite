import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.create(createUserDto);
    return this.mapToResponseDto(user);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users', type: [UserResponseDto] })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll();
    return users.map(user => this.mapToResponseDto(user));
  }

  @Get('contractors')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all contractors' })
  @ApiResponse({ status: 200, description: 'Return all contractors', type: [UserResponseDto] })
  async findAllContractors(): Promise<UserResponseDto[]> {
    const contractors = await this.userService.findAllContractors();
    return contractors.map(contractor => this.mapToResponseDto(contractor));
  }

  @Get('clients')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 200, description: 'Return all clients', type: [UserResponseDto] })
  async findAllClients(): Promise<UserResponseDto[]> {
    const clients = await this.userService.findAllClients();
    return clients.map(client => this.mapToResponseDto(client));
  }

  @Get('site-engineers')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all site engineers' })
  @ApiResponse({ status: 200, description: 'Return all site engineers', type: [UserResponseDto] })
  async findAllSiteEngineers(): Promise<UserResponseDto[]> {
    const siteEngineers = await this.userService.findAllSiteEngineers();
    return siteEngineers.map(engineer => this.mapToResponseDto(engineer));
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string, @Request() req): Promise<UserResponseDto> {
    // Allow users to access their own data
    if (req.user.id !== id && req.user.role !== Role.ADMIN) {
      throw new Error('Unauthorized');
    }
    
    const user = await this.userService.findOne(id);
    return this.mapToResponseDto(user);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ): Promise<UserResponseDto> {
    // Allow users to update their own data
    if (req.user.id !== id && req.user.role !== Role.ADMIN) {
      throw new Error('Unauthorized');
    }
    
    const user = await this.userService.update(id, updateUserDto);
    return this.mapToResponseDto(user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.remove(id);
    return { message: 'User deleted successfully' };
  }

  private mapToResponseDto(user: any): UserResponseDto {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}