import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { Response } from 'express';

@Controller('report')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get('csv')
  async downloadCSV(@Req() req: any, @Res() res: Response) {
    const csv = await this.reportService.generateCSV(req.user);
    res.set('Content-Type', 'text/csv');
    res.attachment('survey_report.csv');
    return res.send(csv);
  }
}
