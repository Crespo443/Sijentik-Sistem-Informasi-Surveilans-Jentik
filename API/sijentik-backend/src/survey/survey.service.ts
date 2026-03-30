import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SurveyService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any, user: any) {
    // Village validation: no need to check healthCenterId since villages are now district-level
    return this.prisma.survey.create({
      data: {
        surveyorName: user.name,
        accessCodeId: user.userId,
        villageId: dto.villageId,
        surveyDate: new Date(dto.surveyDate),
        houseOwner: dto.houseOwner,
        rtRw: dto.rtRw,
        address: dto.address,
        occupantCount: dto.occupantCount,
        latitude: dto.latitude,
        longitude: dto.longitude,
        status: 'SUBMITTED',
        notes: dto.notes,
        containers: {
          create: dto.containers.map((c: any) => ({
            category: c.category,
            containerName: c.containerName || '',
            inspectedCount: c.inspectedCount,
            positiveCount: c.positiveCount,
          })),
        },
        interventions: {
          create: dto.interventions.map((i: any) => ({
            activityName: i.activityName,
            isDone: i.isDone,
          })),
        },
      },
      include: { containers: true, interventions: true },
    });
  }

  async findAll(
    user: any,
    query: {
      page?: number;
      limit?: number;
      search?: string;
      villageId?: string;
      startDate?: string;
      endDate?: string;
      puskesmasId?: string;
      status?: string;
    },
  ) {
    const {
      page = 1,
      limit = 10,
      search,
      villageId,
      startDate,
      endDate,
      puskesmasId,
      status,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (user.role === 'SURVEYOR' || user.role === 'HEALTHCARE_MANAGER') {
      // Scope: surveys submitted by this PKM's access codes
      where.accessCode = { healthCenterId: user.healthCenterId };
    } else if (puskesmasId) {
      where.accessCode = { healthCenterId: puskesmasId };
    }

    // Filtering logic
    if (search) {
      where.OR = [
        { houseOwner: { contains: search, mode: 'insensitive' } },
        { surveyorName: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (villageId) where.villageId = villageId;
    if (startDate && endDate)
      where.surveyDate = { gte: new Date(startDate), lte: new Date(endDate) };
    if (status === 'Positif') {
      where.containers = { some: { positiveCount: { gt: 0 } } };
    } else if (status === 'Negatif') {
      // either has containers but all have positiveCount 0, or we can just say 'every' positiveCount = 0
      // the exact logic depends, but `none` > 0 works.
      where.containers = { none: { positiveCount: { gt: 0 } } };
    }

    const [total, data] = await Promise.all([
      this.prisma.survey.count({ where }),
      this.prisma.survey.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          village: true,
          containers: true,
          accessCode: { include: { healthCenter: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data,
      meta: { total, page, limit, lastPage: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const survey = await this.prisma.survey.findUnique({
      where: { id },
      include: {
        village: true,
        containers: true,
        interventions: true,
        accessCode: { include: { healthCenter: true } },
      },
    });
    if (!survey) throw new NotFoundException('Survey not found');
    return survey;
  }

  async update(id: string, dto: any, user: any) {
    const survey = await this.findOne(id);
    if (user.role === 'SURVEYOR' && survey.surveyorName !== user.name)
      throw new ForbiddenException('You can only update your own surveys');
    if (user.role === 'HEALTHCARE_MANAGER') {
      const ac = await this.prisma.accessCode.findUnique({
        where: { id: survey.accessCodeId },
      });
      if (ac?.healthCenterId !== user.healthCenterId)
        throw new ForbiddenException(
          'You can only update surveys within your health center scope',
        );
    }
    await this.prisma.surveyContainer.deleteMany({ where: { surveyId: id } });
    await this.prisma.surveyIntervention.deleteMany({
      where: { surveyId: id },
    });
    return this.prisma.survey.update({
      where: { id },
      data: {
        villageId: dto.villageId,
        surveyDate: new Date(dto.surveyDate),
        houseOwner: dto.houseOwner,
        rtRw: dto.rtRw,
        address: dto.address,
        occupantCount: dto.occupantCount,
        latitude: dto.latitude,
        longitude: dto.longitude,
        notes: dto.notes,
        containers: {
          create: dto.containers.map((c: any) => ({
            category: c.category,
            containerName: c.containerName || '',
            inspectedCount: c.inspectedCount,
            positiveCount: c.positiveCount,
          })),
        },
        interventions: {
          create: dto.interventions.map((i: any) => ({
            activityName: i.activityName,
            isDone: i.isDone,
          })),
        },
      },
      include: { containers: true, interventions: true },
    });
  }

  async remove(id: string, user: any) {
    const survey = await this.findOne(id);
    if (user.role === 'SURVEYOR')
      throw new ForbiddenException('Surveyors cannot delete surveys');
    if (user.role === 'HEALTHCARE_MANAGER') {
      // Check that this survey belongs to the PKM's scope via access code
      const ac = await this.prisma.accessCode.findUnique({
        where: { id: survey.accessCodeId },
      });
      if (ac?.healthCenterId !== user.healthCenterId)
        throw new ForbiddenException('Unauthorized');
    }
    await this.prisma.surveyContainer.deleteMany({ where: { surveyId: id } });
    await this.prisma.surveyIntervention.deleteMany({
      where: { surveyId: id },
    });
    return this.prisma.survey.delete({ where: { id } });
  }
}
