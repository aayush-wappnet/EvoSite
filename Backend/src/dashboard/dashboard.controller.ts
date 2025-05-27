import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { User } from '../user/entities/user.entity';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Returns admin dashboard statistics' })
  async getAdminStats(@Request() req) {
    return this.dashboardService.getAdminStats(req.user);
  }

  @Get('contractor')
  @Roles(Role.CONTRACTOR)
  @ApiOperation({ summary: 'Get contractor dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Returns contractor dashboard statistics' })
  async getContractorStats(@Request() req) {
    return this.dashboardService.getContractorStats(req.user);
  }

  @Get('site-engineer')
  @Roles(Role.SITE_ENGINEER)
  @ApiOperation({ summary: 'Get site engineer dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Returns site engineer dashboard statistics' })
  async getSiteEngineerStats(@Request() req) {
    return this.dashboardService.getSiteEngineerStats(req.user);
  }

  @Get('client')
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Get client dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Returns client dashboard statistics' })
  async getClientStats(@Request() req) {
    return this.dashboardService.getClientStats(req.user);
  }
} 