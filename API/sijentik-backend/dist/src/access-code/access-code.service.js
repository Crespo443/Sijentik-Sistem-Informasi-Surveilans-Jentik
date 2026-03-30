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
exports.AccessCodeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AccessCodeService = class AccessCodeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generate(dto) {
        const exists = await this.prisma.accessCode.findUnique({
            where: { code: dto.code },
        });
        if (exists)
            throw new common_1.ConflictException('Access code already exists');
        return this.prisma.accessCode.create({
            data: {
                code: dto.code,
                type: dto.type,
                healthCenterId: dto.healthCenterId,
            },
        });
    }
    findAll() {
        return this.prisma.accessCode.findMany({
            include: { healthCenter: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async toggleStatus(id) {
        const code = await this.prisma.accessCode.findUnique({ where: { id } });
        if (!code)
            throw new common_1.NotFoundException('Access code not found');
        return this.prisma.accessCode.update({
            where: { id },
            data: { isActive: !code.isActive },
        });
    }
};
exports.AccessCodeService = AccessCodeService;
exports.AccessCodeService = AccessCodeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccessCodeService);
//# sourceMappingURL=access-code.service.js.map