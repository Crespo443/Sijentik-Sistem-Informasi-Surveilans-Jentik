"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getWhereClause(user, startDate, endDate) {
        const where = {};
        if (user.role === 'HEALTHCARE_MANAGER' || user.role === 'SURVEYOR') {
            where.accessCode = { healthCenterId: user.healthCenterId };
        }
        if (startDate && endDate) {
            where.surveyDate = { gte: new Date(startDate), lte: new Date(endDate) };
        }
        return where;
    }
    calculateDF(hi, ci, bi) {
        if (hi === 0)
            return 0;
        if (hi < 4)
            return 1;
        if (hi < 8)
            return 2;
        if (hi < 18)
            return 3;
        if (hi < 29)
            return 4;
        if (hi < 38)
            return 5;
        if (hi < 50)
            return 6;
        if (hi < 60)
            return 7;
        if (hi < 77)
            return 8;
        return 9;
    }
    calculateMayaIndex(df) {
        if (df < 3)
            return 'Low';
        if (df < 6)
            return 'Medium';
        return 'High';
    }
    async getDashboardKPIs(user, startDate, endDate) {
        const whereClause = this.getWhereClause(user, startDate, endDate);
        let jumlahPuskesmas = 1;
        let totalTargetHouses = 0;
        if (user.role === 'ADMIN') {
            jumlahPuskesmas = await this.prisma.healthCenter.count();
            const allPkm = await this.prisma.healthCenter.findMany({
                select: { targetHouses: true },
            });
            totalTargetHouses = allPkm.reduce((sum, p) => sum + (p.targetHouses ?? 0), 0);
        }
        else if (user.healthCenterId) {
            const pkm = await this.prisma.healthCenter.findUnique({
                where: { id: user.healthCenterId },
                select: { targetHouses: true },
            });
            totalTargetHouses = pkm?.targetHouses ?? 0;
        }
        const surveys = await this.prisma.survey.findMany({
            where: whereClause,
            include: { containers: true },
        });
        if (surveys.length === 0) {
            return {
                totalSurveys: 0,
                abjSurvei: 0,
                abjWilayah: totalTargetHouses > 0 ? 100 : null,
                houseIndex: 0,
                containerIndex: 0,
                breteauIndex: 0,
                positiveHouses: 0,
                jumlahPuskesmas,
                totalTargetHouses,
                densityFigure: 0,
                mayaIndex: 'Low',
            };
        }
        let positiveHouses = 0;
        let totalContainersInspected = 0;
        let totalContainersPositive = 0;
        surveys.forEach((survey) => {
            const isPositive = survey.containers.some((c) => c.positiveCount > 0);
            if (isPositive)
                positiveHouses++;
            survey.containers.forEach((c) => {
                totalContainersInspected += c.inspectedCount;
                totalContainersPositive += c.positiveCount;
            });
        });
        const totalSurveys = surveys.length;
        const abjSurvei = ((totalSurveys - positiveHouses) / totalSurveys) * 100;
        const abjWilayah = totalTargetHouses > 0
            ? ((totalTargetHouses - positiveHouses) / totalTargetHouses) * 100
            : null;
        const hi = (positiveHouses / totalSurveys) * 100;
        const ci = totalContainersInspected > 0
            ? (totalContainersPositive / totalContainersInspected) * 100
            : 0;
        const bi = (totalContainersPositive / totalSurveys) * 100;
        const densityFigure = this.calculateDF(hi, ci, bi);
        const mayaIndex = this.calculateMayaIndex(densityFigure);
        return {
            totalSurveys,
            abjSurvei: parseFloat(abjSurvei.toFixed(2)),
            abjWilayah: abjWilayah !== null ? parseFloat(abjWilayah.toFixed(2)) : null,
            houseIndex: parseFloat(hi.toFixed(2)),
            containerIndex: parseFloat(ci.toFixed(2)),
            breteauIndex: parseFloat(bi.toFixed(2)),
            positiveHouses,
            jumlahPuskesmas,
            totalTargetHouses,
            densityFigure,
            mayaIndex,
        };
    }
    async getRegionalPerformance(user) {
        if (user.role === 'ADMIN') {
            const healthCenters = await this.prisma.healthCenter.findMany({
                include: {
                    accessCodes: {
                        include: { surveys: { include: { containers: true } } },
                    },
                },
            });
            return healthCenters.map((pkm) => {
                const surveys = pkm.accessCodes.flatMap((ac) => ac.surveys);
                return this.calculateRegionStats(pkm.name, surveys, pkm.targetHouses);
            });
        }
        else {
            const surveys = await this.prisma.survey.findMany({
                where: { accessCode: { healthCenterId: user.healthCenterId } },
                include: { containers: true, village: true },
            });
            const grouped = surveys.reduce((acc, s) => {
                const key = s.village.name;
                if (!acc[key])
                    acc[key] = [];
                acc[key].push(s);
                return acc;
            }, {});
            return Object.entries(grouped).map(([name, surveysInVillage]) => this.calculateRegionStats(name, surveysInVillage, undefined));
        }
    }
    calculateRegionStats(name, surveys, targetHouses) {
        if (surveys.length === 0) {
            return {
                name,
                totalSurveys: 0,
                targetHouses: targetHouses ?? 0,
                abj: 0,
                abjWilayah: targetHouses && targetHouses > 0 ? 100 : null,
                houseIndex: 0,
                containerIndex: 0,
                breteauIndex: 0,
                densityFigure: 0,
                riskLevel: 'UNKNOWN',
            };
        }
        const totalSurveys = surveys.length;
        const positiveHouses = surveys.filter((s) => s.containers.some((c) => c.positiveCount > 0)).length;
        let totalContainersInspected = 0;
        let totalContainersPositive = 0;
        surveys.forEach((s) => {
            s.containers.forEach((c) => {
                totalContainersInspected += c.inspectedCount;
                totalContainersPositive += c.positiveCount;
            });
        });
        const abjSurvei = ((totalSurveys - positiveHouses) / totalSurveys) * 100;
        const abjWilayah = targetHouses && targetHouses > 0
            ? ((targetHouses - positiveHouses) / targetHouses) * 100
            : null;
        const hi = (positiveHouses / totalSurveys) * 100;
        const ci = totalContainersInspected > 0
            ? (totalContainersPositive / totalContainersInspected) * 100
            : 0;
        const bi = (totalContainersPositive / totalSurveys) * 100;
        const densityFigure = this.calculateDF(hi, ci, bi);
        let riskLevel = 'TARGET';
        if (abjSurvei < 80)
            riskLevel = 'CRITICAL';
        else if (abjSurvei < 95)
            riskLevel = 'WARNING';
        return {
            name,
            totalSurveys,
            targetHouses: targetHouses ?? 0,
            abj: parseFloat(abjSurvei.toFixed(2)),
            abjWilayah: abjWilayah !== null ? parseFloat(abjWilayah.toFixed(2)) : null,
            houseIndex: parseFloat(hi.toFixed(2)),
            containerIndex: parseFloat(ci.toFixed(2)),
            breteauIndex: parseFloat(bi.toFixed(2)),
            densityFigure,
            riskLevel,
        };
    }
    async getRecentActivity(user) {
        const whereClause = this.getWhereClause(user);
        return this.prisma.survey.findMany({
            where: whereClause,
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { village: true, containers: true },
        });
    }
    async getRiskMap(user) {
        const whereClause = this.getWhereClause(user);
        const surveys = await this.prisma.survey.findMany({
            where: whereClause,
            include: { containers: true, village: true },
        });
        return surveys.map((s) => ({
            id: s.id,
            lat: s.latitude,
            lng: s.longitude,
            houseOwner: s.houseOwner,
            village: s.village.name,
            riskLevel: s.containers.some((c) => c.positiveCount > 0) ? 'HIGH' : 'LOW',
        }));
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map