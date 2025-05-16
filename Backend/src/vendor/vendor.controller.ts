import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorResponseDto } from './dto/vendor-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Vendors')
@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiResponse({ status: 201, description: 'Vendor created successfully', type: VendorResponseDto })
  async create(@Body() createVendorDto: CreateVendorDto): Promise<VendorResponseDto> {
    return this.vendorService.create(createVendorDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Get all vendors' })
  @ApiResponse({ status: 200, description: 'Return all vendors', type: [VendorResponseDto] })
  async findAll(): Promise<VendorResponseDto[]> {
    return this.vendorService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Get a vendor by ID' })
  @ApiResponse({ status: 200, description: 'Return the vendor', type: VendorResponseDto })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async findOne(@Param('id') id: string): Promise<VendorResponseDto> {
    return this.vendorService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a vendor' })
  @ApiResponse({ status: 200, description: 'Vendor updated successfully', type: VendorResponseDto })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async update(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ): Promise<VendorResponseDto> {
    return this.vendorService.update(id, updateVendorDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a vendor' })
  @ApiResponse({ status: 200, description: 'Vendor deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.vendorService.remove(id);
    return { message: 'Vendor deleted successfully' };
  }
}