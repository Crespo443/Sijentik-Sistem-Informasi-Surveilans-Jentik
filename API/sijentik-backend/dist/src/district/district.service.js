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
exports.DistrictService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DistrictService = class DistrictService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(user) {
        const where = {};
        if (user?.role === 'HEALTHCARE_MANAGER' && user.districtId) {
            where.id = user.districtId;
        }
        return this.prisma.district.findMany({
            where,
            include: {
                _count: { select: { healthCenters: true, villages: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    create(data) {
        return this.prisma.district.create({ data });
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.district.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.district.delete({ where: { id } });
    }
    async findOne(id) {
        const district = await this.prisma.district.findUnique({
            where: { id },
            include: {
                healthCenters: true,
                villages: { orderBy: { name: 'asc' } },
            },
        });
        if (!district)
            throw new common_1.NotFoundException('District not found');
        return district;
    }
};
exports.DistrictService = DistrictService;
exports.DistrictService = DistrictService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DistrictService);
//# sourceMappingURL=district.service.js.map