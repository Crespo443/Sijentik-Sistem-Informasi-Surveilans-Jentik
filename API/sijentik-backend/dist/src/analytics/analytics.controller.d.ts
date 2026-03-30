import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(req: any, startDate?: string, endDate?: string): Promise<{
        totalSurveys: number;
        abjSurvei: number;
        abjWilayah: number;
        houseIndex: number;
        containerIndex: number;
        breteauIndex: number;
        positiveHouses: number;
        jumlahPuskesmas: number;
        densityFigure: number;
        mayaIndex: string;
    }>;
    getRegional(req: any): Promise<{
        name: string;
        abj: number;
        totalSurveys: number;
        riskLevel: string;
    }[]>;
    getRecent(req: any): Promise<({
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
    getRiskMap(req: any): Promise<{
        id: string;
        lat: import("@prisma/client/runtime/library").Decimal | null;
        lng: import("@prisma/client/runtime/library").Decimal | null;
        houseOwner: string;
        village: string;
        riskLevel: string;
    }[]>;
}
