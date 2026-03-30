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
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportService = class ReportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateCSV(user) {
        const whereClause = {};
        if (user.role === 'HEALTHCARE_MANAGER' || user.role === 'SURVEYOR') {
            whereClause.village = { healthCenterId: user.healthCenterId };
        }
        const surveys = await this.prisma.survey.findMany({
            where: whereClause,
            include: { village: true, containers: true },
        });
        let csv = 'Date,Surveyor,Village,Owner,Inspected,Positive,Status\n';
        surveys.forEach((s) => {
            const inspected = s.containers.reduce((acc, c) => acc + c.inspectedCount, 0);
            const positive = s.containers.reduce((acc, c) => acc + c.positiveCount, 0);
            csv += `${s.surveyDate},${s.surveyorName},${s.village.name},${s.houseOwner},${inspected},${positive},${s.status}\n`;
        });
        return csv;
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportService);
//# sourceMappingURL=report.service.js.map