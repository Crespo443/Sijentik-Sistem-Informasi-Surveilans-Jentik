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
import { DistrictService } from './district.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('district')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DistrictController {
  constructor(private districtService: DistrictService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.districtService.findAll(req.user);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() data: any) {
    return this.districtService.create(data);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() data: any) {
    return this.districtService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.districtService.remove(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(id);
  }
}
