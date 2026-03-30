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
exports.SurveyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SurveyService = class SurveyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, user) {
        return this.prisma.survey.create({
            data: {
                surveyorName: user.name,
                accessCodeId: user.userId,
                villageId: dto.villageId,
                surveyDate: new Date(dto.surveyDate),
                houseOwner: dto.houseOwner,
                rtRw: dto.rtRw,
                address: dto.address,
                occupantCount: dto.occupantCount,
                latitude: dto.latitude,
                longitude: dto.longitude,
                status: 'SUBMITTED',
                notes: dto.notes,
                containers: {
                    create: dto.containers.map((c) => ({
                        category: c.category,
                        containerName: c.containerName || '',
                        inspectedCount: c.inspectedCount,
                        positiveCount: c.positiveCount,
                    })),
                },
                interventions: {
                    create: dto.interventions.map((i) => ({
                        activityName: i.activityName,
                        isDone: i.isDone,
                    })),
                },
            },
            include: { containers: true, interventions: true },
        });
    }
    async findAll(user, query) {
        const { page = 1, limit = 10, search, villageId, startDate, endDate, puskesmasId, status, } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (user.role === 'SURVEYOR' || user.role === 'HEALTHCARE_MANAGER') {
            where.accessCode = { healthCenterId: user.healthCenterId };
        }
        else if (puskesmasId) {
            where.accessCode = { healthCenterId: puskesmasId };
        }
        if (search) {
            where.OR = [
                { houseOwner: { contains: search, mode: 'insensitive' } },
                { surveyorName: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (villageId)
            where.villageId = villageId;
        if (startDate && endDate)
            where.surveyDate = { gte: new Date(startDate), lte: new Date(endDate) };
        if (status === 'Positif') {
            where.containers = { some: { positiveCount: { gt: 0 } } };
        }
        else if (status === 'Negatif') {
            where.containers = { none: { positiveCount: { gt: 0 } } };
        }
        const [total, data] = await Promise.all([
            this.prisma.survey.count({ where }),
            this.prisma.survey.findMany({
                where,
                skip,
                take: Number(limit),
                include: {
                    village: true,
                    containers: true,
                    accessCode: { include: { healthCenter: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        return {
            data,
            meta: { total, page, limit, lastPage: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const survey = await this.prisma.survey.findUnique({
            where: { id },
            include: {
                village: true,
                containers: true,
                interventions: true,
                accessCode: { include: { healthCenter: true } },
            },
        });
        if (!survey)
            throw new common_1.NotFoundException('Survey not found');
        return survey;
    }
    async update(id, dto, user) {
        const survey = await this.findOne(id);
        if (user.role === 'SURVEYOR' && survey.surveyorName !== user.name)
            throw new common_1.ForbiddenException('You can only update your own surveys');
        if (user.role === 'HEALTHCARE_MANAGER') {
            const ac = await this.prisma.accessCode.findUnique({
                where: { id: survey.accessCodeId },
            });
            if (ac?.healthCenterId !== user.healthCenterId)
                throw new common_1.ForbiddenException('You can only update surveys within your health center scope');
        }
        await this.prisma.surveyContainer.deleteMany({ where: { surveyId: id } });
        await this.prisma.surveyIntervention.deleteMany({
            where: { surveyId: id },
        });
        return this.prisma.survey.update({
            where: { id },
            data: {
                villageId: dto.villageId,
                surveyDate: new Date(dto.surveyDate),
                houseOwner: dto.houseOwner,
                rtRw: dto.rtRw,
                address: dto.address,
                occupantCount: dto.occupantCount,
                latitude: dto.latitude,
                longitude: dto.longitude,
                notes: dto.notes,
                containers: {
                    create: dto.containers.map((c) => ({
                        category: c.category,
                        containerName: c.containerName || '',
                        inspectedCount: c.inspectedCount,
                        positiveCount: c.positiveCount,
                    })),
                },
                interventions: {
                    create: dto.interventions.map((i) => ({
                        activityName: i.activityName,
                        isDone: i.isDone,
                    })),
                },
            },
            include: { containers: true, interventions: true },
        });
    }
    async remove(id, user) {
        const survey = await this.findOne(id);
        if (user.role === 'SURVEYOR')
            throw new common_1.ForbiddenException('Surveyors cannot delete surveys');
        if (user.role === 'HEALTHCARE_MANAGER') {
            const ac = await this.prisma.accessCode.findUnique({
                where: { id: survey.accessCodeId },
            });
            if (ac?.healthCenterId !== user.healthCenterId)
                throw new common_1.ForbiddenException('Unauthorized');
        }
        await this.prisma.surveyContainer.deleteMany({ where: { surveyId: id } });
        await this.prisma.surveyIntervention.deleteMany({
            where: { surveyId: id },
        });
        return this.prisma.survey.delete({ where: { id } });
    }
};
exports.SurveyService = SurveyService;
exports.SurveyService = SurveyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SurveyService);
//# sourceMappingURL=survey.service.js.map