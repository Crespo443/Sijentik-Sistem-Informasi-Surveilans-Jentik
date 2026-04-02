import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  private getWhereClause(user: any, startDate?: string, endDate?: string, districtId?: string) {
    const where: any = {};
    if (user.role === 'HEALTHCARE_MANAGER' || user.role === 'SURVEYOR') {
      // Filter surveys by the PKM's access code scope
      where.accessCode = { healthCenterId: user.healthCenterId };
    }
    if (startDate && endDate) {
      where.surveyDate = { gte: new Date(startDate), lte: new Date(endDate) };
    }
    if (districtId) {
      where.village = { districtId };
    }
    return where;
  }

  private calculateDF(hi: number, ci: number, bi: number) {
    // Simplified WHO Density Figure mapping based on HI
    if (hi === 0) return 0;
    if (hi < 4) return 1;
    if (hi < 8) return 2;
    if (hi < 18) return 3;
    if (hi < 29) return 4;
    if (hi < 38) return 5;
    if (hi < 50) return 6;
    if (hi < 60) return 7;
    if (hi < 77) return 8;
    return 9;
  }

  private calculateMayaIndex(df: number) {
    if (df < 3) return 'Low';
    if (df < 6) return 'Medium';
    return 'High';
  }

  async getDashboardKPIs(user: any, startDate?: string, endDate?: string, districtId?: string) {
    const whereClause = this.getWhereClause(user, startDate, endDate, districtId);

    // Get total puskesmas count & total registered houses based on scope
    let jumlahPuskesmas = 1;
    let totalTargetHouses = 0;

    if (user.role === 'ADMIN') {
      jumlahPuskesmas = await this.prisma.healthCenter.count({
        where: districtId ? { districtId } : undefined
      });
      // Sum targetHouses from ALL health centers for kabupaten-level ABJ Wilayah
      const allPkm = await this.prisma.healthCenter.findMany({
        where: districtId ? { districtId } : undefined,
        select: { targetHouses: true },
      });
      totalTargetHouses = allPkm.reduce((sum, p) => sum + (p.targetHouses ?? 0), 0);
    } else if (user.healthCenterId) {
      // For PKM-level, use own targetHouses
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
      if (isPositive) positiveHouses++;
      survey.containers.forEach((c) => {
        totalContainersInspected += c.inspectedCount;
        totalContainersPositive += c.positiveCount;
      });
    });

    const totalSurveys = surveys.length;

    // ABJ Survei: based on houses actually surveyed
    const abjSurvei = ((totalSurveys - positiveHouses) / totalSurveys) * 100;

    // ABJ Wilayah: based on total REGISTERED houses in the area (targetHouses)
    const abjWilayah =
      totalTargetHouses > 0
        ? ((totalTargetHouses - positiveHouses) / totalTargetHouses) * 100
        : null;

    const hi = (positiveHouses / totalSurveys) * 100;
    const ci =
      totalContainersInspected > 0
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

  async getRegionalPerformance(user: any, startDate?: string, endDate?: string, districtId?: string) {
    if (user.role === 'ADMIN') {
      // Show stats grouped by health center (PKM)
      // Include targetHouses so ABJ Wilayah can use real registered house count
      const healthCenters = await this.prisma.healthCenter.findMany({
        where: districtId ? { districtId } : undefined,
        include: {
          district: true,
          accessCodes: {
            include: { 
              surveys: {
                where: startDate && endDate ? { surveyDate: { gte: new Date(startDate), lte: new Date(endDate) } } : undefined,
                include: { containers: true } 
              } 
            },
          },
        },
      });
      return healthCenters.map((pkm) => {
        const surveys = pkm.accessCodes.flatMap((ac) => ac.surveys);
        return this.calculateRegionStats(pkm.name, surveys, pkm.targetHouses, pkm.district?.name);
      });
    } else {
      // Show stats grouped by village for this PKM's surveys
      // Villages don't have their own house count, so ABJ Wilayah = null at village level
      const surveys = await this.prisma.survey.findMany({
        where: { 
          accessCode: { healthCenterId: user.healthCenterId },
          ...(startDate && endDate ? { surveyDate: { gte: new Date(startDate), lte: new Date(endDate) } } : {}),
          ...(districtId ? { village: { districtId } } : {})
        },
        include: { containers: true, village: true },
      });
      const grouped = surveys.reduce<Record<string, any[]>>((acc, s) => {
        const key = s.village.name;
        if (!acc[key]) acc[key] = [];
        acc[key].push(s);
        return acc;
      }, {});
      return Object.entries(grouped).map(([name, surveysInVillage]) =>
        this.calculateRegionStats(name, surveysInVillage, undefined, undefined),
      );
    }
  }

  private calculateRegionStats(
    name: string,
    surveys: any[],
    targetHouses?: number,
    districtName?: string,
  ) {
    if (surveys.length === 0) {
      return {
        name,
        districtName,
        totalSurveys: 0,
        positiveHouses: 0,
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
    const positiveHouses = surveys.filter((s) =>
      s.containers.some((c) => c.positiveCount > 0),
    ).length;

    let totalContainersInspected = 0;
    let totalContainersPositive = 0;
    surveys.forEach((s) => {
      s.containers.forEach((c) => {
        totalContainersInspected += c.inspectedCount;
        totalContainersPositive += c.positiveCount;
      });
    });

    // ABJ Survei: (rumah disurvei - positif) / rumah disurvei × 100
    const abjSurvei = ((totalSurveys - positiveHouses) / totalSurveys) * 100;

    // ABJ Wilayah: (targetHouses - positif) / targetHouses × 100
    // Uses the REGISTERED house count from HealthCenter, not surveyed count
    const abjWilayah =
      targetHouses && targetHouses > 0
        ? ((targetHouses - positiveHouses) / targetHouses) * 100
        : null;

    const hi = (positiveHouses / totalSurveys) * 100;
    const ci =
      totalContainersInspected > 0
        ? (totalContainersPositive / totalContainersInspected) * 100
        : 0;
    const bi = (totalContainersPositive / totalSurveys) * 100;
    const densityFigure = this.calculateDF(hi, ci, bi);

    let riskLevel = 'TARGET';
    if (abjSurvei < 80) riskLevel = 'CRITICAL';
    else if (abjSurvei < 95) riskLevel = 'WARNING';

    return {
      name,
      districtName,
      totalSurveys,
      targetHouses: targetHouses ?? 0,
      positiveHouses,
      abj: parseFloat(abjSurvei.toFixed(2)),
      abjWilayah: abjWilayah !== null ? parseFloat(abjWilayah.toFixed(2)) : null,
      houseIndex: parseFloat(hi.toFixed(2)),
      containerIndex: parseFloat(ci.toFixed(2)),
      breteauIndex: parseFloat(bi.toFixed(2)),
      densityFigure,
      riskLevel,
    };
  }

  async getAbjTrend(user: any, year: string, districtId?: string) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    const whereClause = this.getWhereClause(user, startDate, endDate, districtId);

    const surveys = await this.prisma.survey.findMany({
      where: whereClause,
      include: { containers: true },
    });

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalSurveys: 0,
      positiveHouses: 0,
      abjSurvei: null as number | null,
    }));

    surveys.forEach((survey) => {
      const month = survey.surveyDate.getMonth();
      const isPositive = survey.containers.some((c) => c.positiveCount > 0);
      
      monthlyData[month].totalSurveys++;
      if (isPositive) monthlyData[month].positiveHouses++;
    });

    return monthlyData.map(data => {
      if (data.totalSurveys === 0) return data;
      const abjSurvei = ((data.totalSurveys - data.positiveHouses) / data.totalSurveys) * 100;
      return { ...data, abjSurvei: parseFloat(abjSurvei.toFixed(2)) };
    });
  }

  async getRecentActivity(user: any) {
    const whereClause = this.getWhereClause(user);
    return this.prisma.survey.findMany({
      where: whereClause,
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { village: true, containers: true },
    });
  }

  async getRiskMap(user: any) {
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
}
