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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateAccessCode(name, code, role) {
        const accessCode = await this.prisma.accessCode.findUnique({
            where: { code },
            include: { healthCenter: true },
        });
        if (!accessCode || !accessCode.isActive) {
            throw new common_1.UnauthorizedException('Invalid or inactive access code');
        }
        if (accessCode.type === 'ADMIN' && role !== 'ADMIN') {
            throw new common_1.UnauthorizedException('Admin code can only be used by Admin role');
        }
        if (accessCode.type === 'PKM_UNIT' &&
            !['HEALTHCARE_MANAGER', 'SURVEYOR'].includes(role)) {
            throw new common_1.UnauthorizedException('PKM code can only be used by Manager or Surveyor role');
        }
        const payload = {
            name,
            role,
            healthCenterId: accessCode.healthCenterId,
            districtId: accessCode.healthCenter?.districtId,
            accessCodeId: accessCode.id,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                name,
                role,
                healthCenter: accessCode.healthCenter,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map