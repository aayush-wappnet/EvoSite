import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SiteResponseDto } from './dto/site-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Sites')
@Controller('sites')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new site' })
  @ApiResponse({ status: 201, description: 'Site created successfully', type: SiteResponseDto })
  async create(@Body() createSiteDto: CreateSiteDto): Promise<SiteResponseDto> {
    return this.siteService.create(createSiteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sites as per user role' })
  @ApiResponse({ status: 200, description: 'Return all sites', type: [SiteResponseDto] })
  async findAll(@Request() req): Promise<SiteResponseDto[]> {
    return this.siteService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a site by ID' })
  @ApiResponse({ status: 200, description: 'Return the site', type: SiteResponseDto })
  @ApiResponse({ status: 404, description: 'Site not found' })
  async findOne(@Param('id') id: string): Promise<SiteResponseDto> {
    return this.siteService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a site' })
  @ApiResponse({ status: 200, description: 'Site updated successfully', type: SiteResponseDto })
  @ApiResponse({ status: 404, description: 'Site not found' })
  async update(
    @Param('id') id: string,
    @Body() updateSiteDto: UpdateSiteDto,
  ): Promise<SiteResponseDto> {
    return this.siteService.update(id, updateSiteDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a site' })
  @ApiResponse({ status: 200, description: 'Site deleted successfully' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.siteService.remove(id);
    return { message: 'Site deleted successfully' };
  }
}