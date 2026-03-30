import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VillageService } from './village.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('village')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class VillageController {
  constructor(private villageService: VillageService) {}

  @Get('by-district/:districtId')
  findByDistrict(@Param('districtId') districtId: string) {
    return this.villageService.findAllByDistrict(districtId);
  }

  @Get('my-pkm')
  findMyPkmVillages(@Request() req: any) {
    return this.villageService.findMyPkmVillages(req.user);
  }

  @Post()
  @Roles('ADMIN')
  create(
    @Body()
    data: {
      name: string;
      districtId: string;
      type?: 'DESA' | 'KELURAHAN';
    },
  ) {
    return this.villageService.create(data);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() data: { name?: string; type?: 'DESA' | 'KELURAHAN' },
  ) {
    return this.villageService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.villageService.remove(id);
  }
}
