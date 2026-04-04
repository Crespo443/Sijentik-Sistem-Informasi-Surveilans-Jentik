import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('survey')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @Post('submit')
  @Roles('SURVEYOR', 'ADMIN')
  create(@Body() dto: any, @Req() req: any) {
    return this.surveyService.create(dto, req.user);
  }

  @Get()
  findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('villageId') villageId?: string,
    @Query('puskesmasId') puskesmasId?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDir') sortDir?: 'asc' | 'desc',
  ) {
    return this.surveyService.findAll(req.user, {
      page,
      limit,
      search,
      villageId,
      puskesmasId,
      status,
      startDate,
      endDate,
      sortBy,
      sortDir,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveyService.findOne(id);
  }

  @Put(':id')
  @Roles('SURVEYOR', 'ADMIN', 'HEALTHCARE_MANAGER')
  update(@Param('id') id: string, @Body() dto: any, @Req() req: any) {
    return this.surveyService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles('HEALTHCARE_MANAGER', 'ADMIN')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.surveyService.remove(id, req.user);
  }
}
