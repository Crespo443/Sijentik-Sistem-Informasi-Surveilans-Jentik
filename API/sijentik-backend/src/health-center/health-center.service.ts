import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthCenterService {
  constructor(private prisma: PrismaService) {}

  findAll(user?: any) {
    const where: any = {};
    if (user?.role === 'HEALTHCARE_MANAGER' && user.healthCenterId) {
      where.id = user.healthCenterId;
    }

    return this.prisma.healthCenter.findMany({
      where,
      include: { district: true, _count: { select: { accessCodes: true } } },
      orderBy: { name: 'asc' },
    });
  }

  create(data: any) {
    return this.prisma.healthCenter.create({ data });
  }

  async update(id: string, data: any, user?: any) {
    if (user?.role === 'HEALTHCARE_MANAGER' && user.healthCenterId !== id) {
      throw new ForbiddenException(
        'You can only update your own health center',
      );
    }
    await this.findOne(id);
    return this.prisma.healthCenter.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.healthCenter.delete({ where: { id } });
  }

  async findOne(id: string) {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      )
    ) {
      throw new BadRequestException('Invalid UUID format');
    }
    const pkm = await this.prisma.healthCenter.findUnique({
      where: { id },
      include: { district: true, accessCodes: true },
    });
    if (!pkm) throw new NotFoundException('PKM not found');
    return pkm;
  }
}
