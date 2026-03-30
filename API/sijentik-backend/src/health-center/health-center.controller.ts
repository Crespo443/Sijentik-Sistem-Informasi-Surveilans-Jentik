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
} from '@nestjs/common';
import { HealthCenterService } from './health-center.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('health-center')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class HealthCenterController {
  constructor(private healthCenterService: HealthCenterService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.healthCenterService.findAll(req.user);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() data: any) {
    return this.healthCenterService.create(data);
  }

  @Put(':id')
  @Roles('ADMIN', 'HEALTHCARE_MANAGER')
  update(@Param('id') id: string, @Body() data: any, @Req() req: any) {
    return this.healthCenterService.update(id, data, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.healthCenterService.remove(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.healthCenterService.findOne(id);
  }
}
