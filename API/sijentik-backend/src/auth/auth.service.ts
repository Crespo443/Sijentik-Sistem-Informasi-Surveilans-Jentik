import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateAccessCode(name: string, code: string, role: string) {
    const accessCode = await this.prisma.accessCode.findUnique({
      where: { code },
      include: { healthCenter: true },
    });

    if (!accessCode || !accessCode.isActive) {
      throw new UnauthorizedException('Invalid or inactive access code');
    }

    // Role Compatibility Check
    if (accessCode.type === 'ADMIN' && role !== 'ADMIN') {
      throw new UnauthorizedException(
        'Admin code can only be used by Admin role',
      );
    }

    if (
      accessCode.type === 'PKM_UNIT' &&
      !['HEALTHCARE_MANAGER', 'SURVEYOR'].includes(role)
    ) {
      throw new UnauthorizedException(
        'PKM code can only be used by Manager or Surveyor role',
      );
    }

    const payload = {
      name,
      role,
      healthCenterId: accessCode.healthCenterId,
      districtId: accessCode.healthCenter?.districtId,
      accessCodeId: accessCode.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        name,
        role,
        healthCenter: accessCode.healthCenter,
      },
    };
  }
}
