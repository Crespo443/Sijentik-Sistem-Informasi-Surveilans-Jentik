import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SurveyModule } from './survey/survey.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DistrictModule } from './district/district.module';
import { HealthCenterModule } from './health-center/health-center.module';
import { VillageModule } from './village/village.module';
import { AccessCodeModule } from './access-code/access-code.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    SurveyModule,
    AnalyticsModule,
    DistrictModule,
    HealthCenterModule,
    VillageModule,
    AccessCodeModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
