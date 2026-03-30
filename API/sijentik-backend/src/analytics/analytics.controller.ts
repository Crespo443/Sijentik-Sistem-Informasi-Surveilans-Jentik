import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard(
    @Req() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getDashboardKPIs(req.user, startDate, endDate);
  }

  @Get('regional-performance')
  @Roles('ADMIN', 'HEALTHCARE_MANAGER')
  getRegional(@Req() req: any) {
    return this.analyticsService.getRegionalPerformance(req.user);
  }

  @Get('recent-activity')
  getRecent(@Req() req: any) {
    return this.analyticsService.getRecentActivity(req.user);
  }

  @Get('risk-map')
  getRiskMap(@Req() req: any) {
    return this.analyticsService.getRiskMap(req.user);
  }
}
