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
exports.Fan = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const celebrity_entity_1 = require("../../celebrity/entities/celebrity.entity");
const notification_entity_1 = require("./notification.entity");
let Fan = class Fan {
    id;
    name;
    email;
    password;
    followedCelebrities;
    notifications;
    createdAt;
    updatedAt;
};
exports.Fan = Fan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Fan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Fan.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], Fan.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], Fan.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => celebrity_entity_1.Celebrity),
    (0, typeorm_1.JoinTable)({
        name: 'fan_follows_celebrity',
        joinColumn: {
            name: 'fan_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'celebrity_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Fan.prototype, "followedCelebrities", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, notification => notification.fan),
    __metadata("design:type", Array)
], Fan.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Fan.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Fan.prototype, "updatedAt", void 0);
exports.Fan = Fan = __decorate([
    (0, typeorm_1.Entity)('fans')
], Fan);
//# sourceMappingURL=fan.entity.js.map