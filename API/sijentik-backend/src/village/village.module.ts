import { Module } from '@nestjs/common';
import { VillageService } from './village.service';
import { VillageController } from './village.controller';

@Module({
  providers: [VillageService],
  controllers: [VillageController],
})
export class VillageModule {}
