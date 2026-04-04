import { PrismaService } from '../prisma/prisma.service';
export declare class SurveyService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: any, user: any): Promise<{
        containers: {
            id: string;
            surveyId: string;
            category: import("@prisma/client").$Enums.ContainerCategory;
            containerName: string;
            inspectedCount: number;
            positiveCount: number;
        }[];
        interventions: {
            id: string;
            activityName: string;
            isDone: boolean;
            surveyId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        address: string | null;
        surveyorName: string;
        surveyDate: Date;
        houseOwner: string;
        rtRw: string | null;
        occupantCount: number | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        status: import("@prisma/client").$Enums.SurveyStatus;
        notes: string | null;
        accessCodeId: string;
        villageId: string;
    }>;
    findAll(user: any, query: {
        page?: number;
        limit?: number;
        search?: string;
        villageId?: string;
        startDate?: string;
        endDate?: string;
        puskesmasId?: string;
        status?: string;
        sortBy?: string;
        sortDir?: 'asc' | 'desc';
    }): Promise<{
        data: ({
            accessCode: {
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
            };
            village: {
                id: string;
                type: import("@prisma/client").$Enums.VillageType;
                name: string;
                districtId: string;
            };
            containers: {
                id: string;
                surveyId: string;
                category: import("@prisma/client").$Enums.ContainerCategory;
                containerName: string;
                inspectedCount: number;
                positiveCount: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            address: string | null;
            surveyorName: string;
            surveyDate: Date;
            houseOwner: string;
            rtRw: string | null;
            occupantCount: number | null;
            latitude: import("@prisma/client/runtime/library").Decimal | null;
            longitude: import("@prisma/client/runtime/library").Decimal | null;
            status: import("@prisma/client").$Enums.SurveyStatus;
            notes: string | null;
            accessCodeId: string;
            villageId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            lastPage: number;
        };
    }>;
    findOne(id: string): Promise<{
        accessCode: {
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
        };
        village: {
            id: string;
            type: import("@prisma/client").$Enums.VillageType;
            name: string;
            districtId: string;
        };
        containers: {
            id: string;
            surveyId: string;
            category: import("@prisma/client").$Enums.ContainerCategory;
            containerName: string;
            inspectedCount: number;
            positiveCount: number;
        }[];
        interventions: {
            id: string;
            activityName: string;
            isDone: boolean;
            surveyId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        address: string | null;
        surveyorName: string;
        surveyDate: Date;
        houseOwner: string;
        rtRw: string | null;
        occupantCount: number | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        status: import("@prisma/client").$Enums.SurveyStatus;
        notes: string | null;
        accessCodeId: string;
        villageId: string;
    }>;
    update(id: string, dto: any, user: any): Promise<{
        containers: {
            id: string;
            surveyId: string;
            category: import("@prisma/client").$Enums.ContainerCategory;
            containerName: string;
            inspectedCount: number;
            positiveCount: number;
        }[];
        interventions: {
            id: string;
            activityName: string;
            isDone: boolean;
            surveyId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        address: string | null;
        surveyorName: string;
        surveyDate: Date;
        houseOwner: string;
        rtRw: string | null;
        occupantCount: number | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        status: import("@prisma/client").$Enums.SurveyStatus;
        notes: string | null;
        accessCodeId: string;
        villageId: string;
    }>;
    remove(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        address: string | null;
        surveyorName: string;
        surveyDate: Date;
        houseOwner: string;
        rtRw: string | null;
        occupantCount: number | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        status: import("@prisma/client").$Enums.SurveyStatus;
        notes: string | null;
        accessCodeId: string;
        villageId: string;
    }>;
}
