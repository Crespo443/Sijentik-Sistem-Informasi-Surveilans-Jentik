import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DistrictService {
  constructor(private prisma: PrismaService) {}

  findAll(user?: any) {
    const where: any = {};
    if (user?.role === 'HEALTHCARE_MANAGER' && user.districtId) {
      where.id = user.districtId;
    }

    return this.prisma.district.findMany({
      where,
      include: {
        _count: { select: { healthCenters: true, villages: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  create(data: any) {
    return this.prisma.district.create({ data });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.district.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.district.delete({ where: { id } });
  }

  async findOne(id: string) {
    const district = await this.prisma.district.findUnique({
      where: { id },
      include: {
        healthCenters: true,
        villages: { orderBy: { name: 'asc' } },
      },
    });
    if (!district) throw new NotFoundException('District not found');
    return district;
  }
}
