import { PrismaService } from '../prisma/prisma.service';
export declare class VillageService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllByDistrict(districtId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        type: import("@prisma/client").$Enums.VillageType;
        name: string;
        districtId: string;
    }[]>;
    findMyPkmVillages(user: any): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.VillageType;
        name: string;
        districtId: string;
    }[]>;
    create(data: {
        name: string;
        districtId: string;
        type?: 'DESA' | 'KELURAHAN';
    }): import("@prisma/client").Prisma.Prisma__VillageClient<{
        id: string;
        type: import("@prisma/client").$Enums.VillageType;
        name: string;
        districtId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: {
        name?: string;
        type?: 'DESA' | 'KELURAHAN';
    }): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.VillageType;
        name: string;
        districtId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.VillageType;
        name: string;
        districtId: string;
    }>;
}
