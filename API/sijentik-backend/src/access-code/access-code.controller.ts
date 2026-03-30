import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AccessCodeService } from './access-code.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('access-code')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AccessCodeController {
  constructor(private accessCodeService: AccessCodeService) {}

  @Post()
  create(@Body() dto: any) {
    return this.accessCodeService.generate(dto);
  }

  @Get()
  findAll() {
    return this.accessCodeService.findAll();
  }

  @Patch(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.accessCodeService.toggleStatus(id);
  }
}
