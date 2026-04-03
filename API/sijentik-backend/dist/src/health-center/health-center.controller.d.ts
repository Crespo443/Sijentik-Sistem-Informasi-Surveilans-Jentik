import { HealthCenterService } from './health-center.service';
export declare class HealthCenterController {
    private healthCenterService;
    constructor(healthCenterService: HealthCenterService);
    findAll(req: any): import("@prisma/client").Prisma.PrismaPromise<({
        district: {
            id: string;
            createdAt: Date;
            name: string;
            headName: string | null;
            phoneNumber: string | null;
            address: string | null;
            areaSize: import("@prisma/client/runtime/library").Decimal | null;
            updatedAt: Date;
        };
        _count: {
            accessCodes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        headName: string | null;
        phoneNumber: string | null;
        address: string | null;
        updatedAt: Date;
        targetHouses: number;
        districtId: string;
    })[]>;
    create(data: any): import("@prisma/client").Prisma.Prisma__HealthCenterClient<{
        id: string;
        createdAt: Date;
        name: string;
        headName: string | null;
        phoneNumber: string | null;
        address: string | null;
        updatedAt: Date;
        targetHouses: number;
        districtId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        headName: string | null;
        phoneNumber: string | null;
        address: string | null;
        updatedAt: Date;
        targetHouses: number;
        districtId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        headName: string | null;
        phoneNumber: string | null;
        address: string | null;
        updatedAt: Date;
        targetHouses: number;
        districtId: string;
    }>;
    findOne(id: string): Promise<{
        district: {
            villages: {
                id: string;
                type: import("@prisma/client").$Enums.VillageType;
                name: string;
                districtId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            name: string;
            headName: string | null;
            phoneNumber: string | null;
            address: string | null;
            areaSize: import("@prisma/client/runtime/library").Decimal | null;
            updatedAt: Date;
        };
        accessCodes: {
            id: string;
            code: string;
            type: import("@prisma/client").$Enums.AccessCodeType;
            isActive: boolean;
            createdAt: Date;
            healthCenterId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        headName: string | null;
        phoneNumber: string | null;
        address: string | null;
        updatedAt: Date;
        targetHouses: number;
        districtId: string;
    }>;
}
