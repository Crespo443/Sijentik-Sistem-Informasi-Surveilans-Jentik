import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateAccessCode(name: string, code: string, role: string): Promise<{
        access_token: string;
        user: {
            name: string;
            role: string;
            healthCenter: {
                id: string;
                createdAt: Date;
                name: string;
                headName: string | null;
                phoneNumber: string | null;
                address: string | null;
                updatedAt: Date;
                targetHouses: number;
                districtId: string;
            } | null;
        };
    }>;
}
