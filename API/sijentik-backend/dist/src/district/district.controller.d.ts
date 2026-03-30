import { DistrictService } from './district.service';
export declare class DistrictController {
    private districtService;
    constructor(districtService: DistrictService);
    findAll(req: any): import("@prisma/client").Prisma.PrismaPromise<({
        _count: {
            healthCenters: number;
            villages: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        headName: string | null;
        phoneNumber: string | null;
        address: string | null;
        areaSize: import("@prisma/client/runtime/library").Decimal | null;
        updatedAt: Date;
    })[]>;
    create(data: any): import("@prisma/client").Prisma.Prisma__DistrictClient<{
        id: string;
        createdAt: Date;
        name: string;
        headName: string | null;
        phoneNumber: string | null;
        address: string | null;
        areaSize: import("@prisma/client/runtime/library").Decimal | null;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        headName: string | null;
        phoneNumber: string | null;
        address: string | null;
        areaSize: import("@prisma/client/runtime/library").Decimal | null;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        headName: string | null;
        phoneNumber: string | null;
        address: string | null;
        areaSize: import("@prisma/client/runtime/library").Decimal | null;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<{
        healthCenters: {
            id: string;
            createdAt: Date;
            name: string;
            headName: string | null;
            phoneNumber: string | null;
            address: string | null;
            updatedAt: Date;
            targetHouses: number;
            districtId: string;
        }[];
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
    }>;
}
