import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VillageService {
  constructor(private prisma: PrismaService) {}

  findAllByDistrict(districtId: string) {
    return this.prisma.village.findMany({
      where: { districtId },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
  }

  async findMyPkmVillages(user: any) {
    if (user.role === 'ADMIN') {
      return this.prisma.village.findMany({
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
      });
    }

    if (!user.healthCenterId) return [];
    const pkm = await this.prisma.healthCenter.findUnique({
      where: { id: user.healthCenterId },
      select: { districtId: true },
    });
    if (!pkm?.districtId) return [];

    return this.prisma.village.findMany({
      where: { districtId: pkm.districtId },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
  }

  create(data: {
    name: string;
    districtId: string;
    type?: 'DESA' | 'KELURAHAN';
  }) {
    return this.prisma.village.create({ data });
  }

  async update(
    id: string,
    data: { name?: string; type?: 'DESA' | 'KELURAHAN' },
  ) {
    const exists = await this.prisma.village.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Village not found');
    return this.prisma.village.update({ where: { id }, data });
  }

  async remove(id: string) {
    const exists = await this.prisma.village.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Village not found');
    return this.prisma.village.delete({ where: { id } });
  }
}
