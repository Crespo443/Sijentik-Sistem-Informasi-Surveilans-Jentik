import { AccessCodeService } from './access-code.service';
export declare class AccessCodeController {
    private accessCodeService;
    constructor(accessCodeService: AccessCodeService);
    create(dto: any): Promise<{
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
    toggle(id: string): Promise<{
        id: string;
        code: string;
        type: import("@prisma/client").$Enums.AccessCodeType;
        isActive: boolean;
        createdAt: Date;
        healthCenterId: string | null;
    }>;
}
