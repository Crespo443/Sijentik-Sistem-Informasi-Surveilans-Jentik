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
exports.CreateSurveyDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var ContainerCategory;
(function (ContainerCategory) {
    ContainerCategory["DAILY"] = "DAILY";
    ContainerCategory["NON_DAILY"] = "NON_DAILY";
    ContainerCategory["NATURAL"] = "NATURAL";
})(ContainerCategory || (ContainerCategory = {}));
class SurveyContainerDto {
    category;
    containerName;
    inspectedCount;
    positiveCount;
}
__decorate([
    (0, class_validator_1.IsEnum)(ContainerCategory),
    __metadata("design:type", String)
], SurveyContainerDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SurveyContainerDto.prototype, "containerName", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SurveyContainerDto.prototype, "inspectedCount", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SurveyContainerDto.prototype, "positiveCount", void 0);
class SurveyInterventionDto {
    activityName;
    isDone;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SurveyInterventionDto.prototype, "activityName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], SurveyInterventionDto.prototype, "isDone", void 0);
class CreateSurveyDto {
    houseOwner;
    villageId;
    surveyDate;
    rtRw;
    address;
    occupantCount;
    latitude;
    longitude;
    notes;
    containers;
    interventions;
}
exports.CreateSurveyDto = CreateSurveyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSurveyDto.prototype, "houseOwner", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSurveyDto.prototype, "villageId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSurveyDto.prototype, "surveyDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSurveyDto.prototype, "rtRw", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSurveyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSurveyDto.prototype, "occupantCount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSurveyDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSurveyDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSurveyDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SurveyContainerDto),
    __metadata("design:type", Array)
], CreateSurveyDto.prototype, "containers", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SurveyInterventionDto),
    __metadata("design:type", Array)
], CreateSurveyDto.prototype, "interventions", void 0);
//# sourceMappingURL=create-survey.dto.js.map