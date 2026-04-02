import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    private getWhereClause;
    private calculateDF;
    private calculateMayaIndex;
    getDashboardKPIs(user: any, startDate?: string, endDate?: string, districtId?: string): Promise<{
        totalSurveys: number;
        abjSurvei: number;
        abjWilayah: number | null;
        houseIndex: number;
        containerIndex: number;
        breteauIndex: number;
        positiveHouses: number;
        jumlahPuskesmas: number;
        totalTargetHouses: number;
        densityFigure: number;
        mayaIndex: string;
    }>;
    getRegionalPerformance(user: any, startDate?: string, endDate?: string, districtId?: string): Promise<{
        name: string;
        districtName: string | undefined;
        totalSurveys: number;
        positiveHouses: number;
        targetHouses: number;
        abj: number;
        abjWilayah: number | null;
        houseIndex: number;
        containerIndex: number;
        breteauIndex: number;
        densityFigure: number;
        riskLevel: string;
    }[]>;
    private calculateRegionStats;
    getAbjTrend(user: any, year: string, districtId?: string): Promise<{
        month: number;
        totalSurveys: number;
        positiveHouses: number;
        abjSurvei: number | null;
    }[]>;
    getRecentActivity(user: any): Promise<({
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
    })[]>;
    getRiskMap(user: any): Promise<{
        id: string;
        lat: import("@prisma/client/runtime/library").Decimal | null;
        lng: import("@prisma/client/runtime/library").Decimal | null;
        houseOwner: string;
        village: string;
        riskLevel: string;
    }[]>;
}
