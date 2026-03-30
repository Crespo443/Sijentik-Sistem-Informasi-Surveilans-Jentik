import { PrismaService } from '../prisma/prisma.service';
export declare class AccessCodeService {
    private prisma;
    constructor(prisma: PrismaService);
    generate(dto: {
        code: string;
        type: 'ADMIN' | 'PKM_UNIT';
        healthCenterId?: string;
    }): Promise<{
        id: string;
        code: string;
        type: import("@prisma/client").$Enums.AccessCodeType;
        isActive: boolean;
        createdAt: Date;
        healthCenterId: string | null;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
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
    } & {
        id: string;
        code: string;
        type: import("@prisma/client").$Enums.AccessCodeType;
        isActive: boolean;
        createdAt: Date;
        healthCenterId: string | null;
    })[]>;
    toggleStatus(id: string): Promise<{
        id: string;
        code: string;
        type: import("@prisma/client").$Enums.AccessCodeType;
        isActive: boolean;
        createdAt: Date;
        healthCenterId: string | null;
    }>;
}
