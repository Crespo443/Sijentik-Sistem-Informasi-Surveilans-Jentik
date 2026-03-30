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
exports.HealthCenterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HealthCenterService = class HealthCenterService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(user) {
        const where = {};
        if (user?.role === 'HEALTHCARE_MANAGER' && user.healthCenterId) {
            where.id = user.healthCenterId;
        }
        return this.prisma.healthCenter.findMany({
            where,
            include: { district: true, _count: { select: { accessCodes: true } } },
            orderBy: { name: 'asc' },
        });
    }
    create(data) {
        return this.prisma.healthCenter.create({ data });
    }
    async update(id, data, user) {
        if (user?.role === 'HEALTHCARE_MANAGER' && user.healthCenterId !== id) {
            throw new common_1.ForbiddenException('You can only update your own health center');
        }
        await this.findOne(id);
        return this.prisma.healthCenter.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.healthCenter.delete({ where: { id } });
    }
    async findOne(id) {
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
            throw new common_1.BadRequestException('Invalid UUID format');
        }
        const pkm = await this.prisma.healthCenter.findUnique({
            where: { id },
            include: { district: true, accessCodes: true },
        });
        if (!pkm)
            throw new common_1.NotFoundException('PKM not found');
        return pkm;
    }
};
exports.HealthCenterService = HealthCenterService;
exports.HealthCenterService = HealthCenterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthCenterService);
//# sourceMappingURL=health-center.service.js.map