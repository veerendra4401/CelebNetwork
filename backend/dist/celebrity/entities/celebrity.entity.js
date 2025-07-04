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
exports.Celebrity = exports.CelebrityCategory = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
var CelebrityCategory;
(function (CelebrityCategory) {
    CelebrityCategory["SINGER"] = "Singer";
    CelebrityCategory["SPEAKER"] = "Speaker";
    CelebrityCategory["ACTOR"] = "Actor";
})(CelebrityCategory || (exports.CelebrityCategory = CelebrityCategory = {}));
let Celebrity = class Celebrity {
    id;
    name;
    category;
    country;
    instagramUrl;
    fanbase;
    setlist;
    socialStats;
    description;
    genres;
    recentPerformances;
    createdAt;
    updatedAt;
};
exports.Celebrity = Celebrity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Celebrity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Celebrity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CelebrityCategory,
    }),
    (0, class_validator_1.IsEnum)(CelebrityCategory),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Celebrity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Celebrity.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], Celebrity.prototype, "instagramUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.Min)(1000),
    __metadata("design:type", Number)
], Celebrity.prototype, "fanbase", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Celebrity.prototype, "setlist", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { default: {} }),
    __metadata("design:type", Object)
], Celebrity.prototype, "socialStats", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Celebrity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Celebrity.prototype, "genres", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { default: {} }),
    __metadata("design:type", Array)
], Celebrity.prototype, "recentPerformances", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Celebrity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Celebrity.prototype, "updatedAt", void 0);
exports.Celebrity = Celebrity = __decorate([
    (0, typeorm_1.Entity)('celebrities')
], Celebrity);
//# sourceMappingURL=celebrity.entity.js.map