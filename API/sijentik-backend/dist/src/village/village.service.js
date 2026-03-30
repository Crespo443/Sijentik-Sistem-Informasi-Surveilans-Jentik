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
exports.VillageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VillageService = class VillageService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAllByDistrict(districtId) {
        return this.prisma.village.findMany({
            where: { districtId },
            orderBy: [{ type: 'asc' }, { name: 'asc' }],
        });
    }
    async findMyPkmVillages(user) {
        if (user.role === 'ADMIN') {
            return this.prisma.village.findMany({
                orderBy: [{ type: 'asc' }, { name: 'asc' }],
            });
        }
        if (!user.healthCenterId)
            return [];
        const pkm = await this.prisma.healthCenter.findUnique({
            where: { id: user.healthCenterId },
            select: { districtId: true },
        });
        if (!pkm?.districtId)
            return [];
        return this.prisma.village.findMany({
            where: { districtId: pkm.districtId },
            orderBy: [{ type: 'asc' }, { name: 'asc' }],
        });
    }
    create(data) {
        return this.prisma.village.create({ data });
    }
    async update(id, data) {
        const exists = await this.prisma.village.findUnique({ where: { id } });
        if (!exists)
            throw new common_1.NotFoundException('Village not found');
        return this.prisma.village.update({ where: { id }, data });
    }
    async remove(id) {
        const exists = await this.prisma.village.findUnique({ where: { id } });
        if (!exists)
            throw new common_1.NotFoundException('Village not found');
        return this.prisma.village.delete({ where: { id } });
    }
};
exports.VillageService = VillageService;
exports.VillageService = VillageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VillageService);
//# sourceMappingURL=village.service.js.map