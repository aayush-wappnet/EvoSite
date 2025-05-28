import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Patch, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialResponseDto } from './dto/material-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { MaterialStatus } from '../common/enums/material-status.enum';
import { OrderMaterialDto } from './dto/order-material.dto';

@ApiTags('Materials')
@Controller('materials')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post('request')
  @Roles(Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Request materials for a site' })
  @ApiResponse({ status: 201, description: 'Material request created successfully', type: MaterialResponseDto })
  async requestMaterial(@Body() createMaterialDto: CreateMaterialDto): Promise<MaterialResponseDto> {
    return this.materialService.create(createMaterialDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Get all material requests' })
  @ApiResponse({ status: 200, description: 'Return all material requests', type: [MaterialResponseDto] })
  async findAll(@Request() req): Promise<MaterialResponseDto[]> {
    return this.materialService.findAll(req.user.role, req.user.id);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Get a material request by ID' })
  @ApiResponse({ status: 200, description: 'Return the material request', type: MaterialResponseDto })
  @ApiResponse({ status: 404, description: 'Material request not found' })
  async findOne(@Param('id') id: string): Promise<MaterialResponseDto> {
    return this.materialService.findOne(id);
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN, Role.CONTRACTOR)
  @ApiOperation({ summary: 'Approve a material request' })
  @ApiResponse({ status: 200, description: 'Material request approved successfully', type: MaterialResponseDto })
  async approveRequest(@Param('id') id: string): Promise<MaterialResponseDto> {
    return this.materialService.updateStatus(id, MaterialStatus.APPROVED);
  }

  @Patch(':id/reject')
  @Roles(Role.ADMIN, Role.CONTRACTOR)
  @ApiOperation({ summary: 'Reject a material request' })
  @ApiResponse({ status: 200, description: 'Material request rejected successfully', type: MaterialResponseDto })
  async rejectRequest(@Param('id') id: string): Promise<MaterialResponseDto> {
    return this.materialService.updateStatus(id, MaterialStatus.REJECTED);
  }

  @Patch(':id/order')
  @Roles(Role.ADMIN, Role.CONTRACTOR)
  @ApiOperation({ summary: 'Order material from vendor' })
  @ApiResponse({ status: 200, description: 'Material ordered successfully', type: MaterialResponseDto })
  async orderMaterial(
    @Param('id') id: string,
    @Body() orderDto: OrderMaterialDto
  ): Promise<MaterialResponseDto> {
    return this.materialService.updateStatus(id, MaterialStatus.ORDERED, orderDto);
  }

  @Patch(':id/deliver')
  @Roles(Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Mark material as delivered' })
  @ApiResponse({ status: 200, description: 'Material marked as delivered successfully', type: MaterialResponseDto })
  async deliverMaterial(@Param('id') id: string): Promise<MaterialResponseDto> {
    return this.materialService.updateStatus(id, MaterialStatus.DELIVERED);
  }

  @Delete(':id')
  @Roles(Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Cancel a material request' })
  @ApiResponse({ status: 200, description: 'Material request cancelled successfully' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.materialService.remove(id);
    return { message: 'Material request cancelled successfully' };
  }
}