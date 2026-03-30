import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async generateCSV(user: any) {
    const whereClause: any = {};
    if (user.role === 'HEALTHCARE_MANAGER' || user.role === 'SURVEYOR') {
      whereClause.village = { healthCenterId: user.healthCenterId };
    }
    const surveys = await this.prisma.survey.findMany({
      where: whereClause,
      include: { village: true, containers: true },
    });

    let csv = 'Date,Surveyor,Village,Owner,Inspected,Positive,Status\n';
    surveys.forEach((s) => {
      const inspected = s.containers.reduce(
        (acc, c) => acc + c.inspectedCount,
        0,
      );
      const positive = s.containers.reduce(
        (acc, c) => acc + c.positiveCount,
        0,
      );
      csv += `${s.surveyDate},${s.surveyorName},${s.village.name},${s.houseOwner},${inspected},${positive},${s.status}\n`;
    });
    return csv;
  }
}
