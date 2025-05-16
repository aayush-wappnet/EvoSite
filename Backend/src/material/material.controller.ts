import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialResponseDto } from './dto/material-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Materials')
@Controller('materials')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Create a new material' })
  @ApiResponse({ status: 201, description: 'Material created successfully', type: MaterialResponseDto })
  async create(@Body() createMaterialDto: CreateMaterialDto): Promise<MaterialResponseDto> {
    return this.materialService.create(createMaterialDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Get all materials' })
  @ApiResponse({ status: 200, description: 'Return all materials', type: [MaterialResponseDto] })
  async findAll(): Promise<MaterialResponseDto[]> {
    return this.materialService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Get a material by ID' })
  @ApiResponse({ status: 200, description: 'Return the material', type: MaterialResponseDto })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async findOne(@Param('id') id: string): Promise<MaterialResponseDto> {
    return this.materialService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Update a material' })
  @ApiResponse({ status: 200, description: 'Material updated successfully', type: MaterialResponseDto })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async update(
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ): Promise<MaterialResponseDto> {
    return this.materialService.update(id, updateMaterialDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a material' })
  @ApiResponse({ status: 200, description: 'Material deleted successfully' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.materialService.remove(id);
    return { message: 'Material deleted successfully' };
  }
}