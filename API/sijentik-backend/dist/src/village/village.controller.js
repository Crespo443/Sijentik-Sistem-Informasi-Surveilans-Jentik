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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VillageController = void 0;
const common_1 = require("@nestjs/common");
const village_service_1 = require("./village.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let VillageController = class VillageController {
    villageService;
    constructor(villageService) {
        this.villageService = villageService;
    }
    findByDistrict(districtId) {
        return this.villageService.findAllByDistrict(districtId);
    }
    findMyPkmVillages(req) {
        return this.villageService.findMyPkmVillages(req.user);
    }
    create(data) {
        return this.villageService.create(data);
    }
    update(id, data) {
        return this.villageService.update(id, data);
    }
    remove(id) {
        return this.villageService.remove(id);
    }
};
exports.VillageController = VillageController;
__decorate([
    (0, common_1.Get)('by-district/:districtId'),
    __param(0, (0, common_1.Param)('districtId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VillageController.prototype, "findByDistrict", null);
__decorate([
    (0, common_1.Get)('my-pkm'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VillageController.prototype, "findMyPkmVillages", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VillageController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VillageController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VillageController.prototype, "remove", null);
exports.VillageController = VillageController = __decorate([
    (0, common_1.Controller)('village'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [village_service_1.VillageService])
], VillageController);
//# sourceMappingURL=village.controller.js.map