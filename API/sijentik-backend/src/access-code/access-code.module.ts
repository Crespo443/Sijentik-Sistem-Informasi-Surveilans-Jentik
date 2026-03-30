import { Module } from '@nestjs/common';
import { AccessCodeService } from './access-code.service';
import { AccessCodeController } from './access-code.controller';

@Module({
  providers: [AccessCodeService],
  controllers: [AccessCodeController],
})
export class AccessCodeModule {}
