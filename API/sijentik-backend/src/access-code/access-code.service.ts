import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccessCodeService {
  constructor(private prisma: PrismaService) {}

  async generate(dto: {
    code: string;
    type: 'ADMIN' | 'PKM_UNIT';
    healthCenterId?: string;
  }) {
    const exists = await this.prisma.accessCode.findUnique({
      where: { code: dto.code },
    });
    if (exists) throw new ConflictException('Access code already exists');

    return this.prisma.accessCode.create({
      data: {
        code: dto.code,
        type: dto.type as any,
        healthCenterId: dto.healthCenterId,
      },
    });
  }

  findAll() {
    return this.prisma.accessCode.findMany({
      include: { healthCenter: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleStatus(id: string) {
    const code = await this.prisma.accessCode.findUnique({ where: { id } });
    if (!code) throw new NotFoundException('Access code not found');
    return this.prisma.accessCode.update({
      where: { id },
      data: { isActive: !code.isActive },
    });
  }
}
