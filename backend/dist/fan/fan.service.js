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
exports.FanService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fan_entity_1 = require("./entities/fan.entity");
const celebrity_service_1 = require("../celebrity/celebrity.service");
const bcrypt = require("bcryptjs");
let FanService = class FanService {
    fanRepository;
    celebrityService;
    constructor(fanRepository, celebrityService) {
        this.fanRepository = fanRepository;
        this.celebrityService = celebrityService;
    }
    async create(createFanDto) {
        const fan = this.fanRepository.create(createFanDto);
        if (fan.password) {
            fan.password = await bcrypt.hash(fan.password, 10);
        }
        return this.fanRepository.save(fan);
    }
    async findAll() {
        return this.fanRepository.find();
    }
    async findOne(id) {
        const fan = await this.fanRepository.findOne({
            where: { id },
            relations: ['followedCelebrities'],
        });
        if (!fan) {
            throw new common_1.NotFoundException(`Fan with ID "${id}" not found`);
        }
        return fan;
    }
    async findByEmail(email) {
        const fan = await this.fanRepository.findOne({
            where: { email },
            relations: ['followedCelebrities'],
        });
        if (!fan) {
            throw new common_1.NotFoundException(`Fan with email "${email}" not found`);
        }
        return fan;
    }
    async update(id, updateFanDto) {
        const fan = await this.findOne(id);
        if (updateFanDto.password) {
            updateFanDto.password = await bcrypt.hash(updateFanDto.password, 10);
        }
        Object.assign(fan, updateFanDto);
        return this.fanRepository.save(fan);
    }
    async remove(id) {
        const fan = await this.findOne(id);
        await this.fanRepository.remove(fan);
    }
    async followCelebrity(fanId, celebrity) {
        const fan = await this.findOne(fanId);
        if (!fan.followedCelebrities) {
            fan.followedCelebrities = [];
        }
        const isAlreadyFollowing = fan.followedCelebrities.some((c) => c.id === celebrity.id);
        if (isAlreadyFollowing) {
            return fan;
        }
        fan.followedCelebrities.push(celebrity);
        return this.fanRepository.save(fan);
    }
    async unfollowCelebrity(fanId, celebrityId) {
        const fan = await this.findOne(fanId);
        const initialLength = fan.followedCelebrities.length;
        fan.followedCelebrities = fan.followedCelebrities.filter((celebrity) => celebrity.id !== celebrityId);
        if (initialLength === fan.followedCelebrities.length) {
            throw new common_1.NotFoundException(`Celebrity with ID "${celebrityId}" not found in followed list`);
        }
        return this.fanRepository.save(fan);
    }
    async getDashboard(fanId) {
        const fan = await this.findOne(fanId);
        return {
            followedCelebrities: fan.followedCelebrities,
            totalFollowing: fan.followedCelebrities.length,
        };
    }
    async updateSettings(id, updateSettingsDto) {
        const fan = await this.findOne(id);
        if (updateSettingsDto.name) {
            fan.name = updateSettingsDto.name;
        }
        return this.fanRepository.save(fan);
    }
    async getNotifications(id) {
        const fan = await this.fanRepository.findOne({
            where: { id },
            relations: ['notifications'],
        });
        if (!fan) {
            throw new common_1.NotFoundException(`Fan with ID "${id}" not found`);
        }
        return fan.notifications || [];
    }
    async markNotificationAsRead(fanId, notificationId) {
        const fan = await this.fanRepository.findOne({
            where: { id: fanId },
            relations: ['notifications'],
        });
        if (!fan) {
            throw new common_1.NotFoundException(`Fan with ID "${fanId}" not found`);
        }
        const notification = fan.notifications.find(n => n.id === notificationId);
        if (!notification) {
            throw new common_1.NotFoundException(`Notification with ID "${notificationId}" not found`);
        }
        notification.isRead = true;
        return this.fanRepository.save(fan);
    }
};
exports.FanService = FanService;
exports.FanService = FanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fan_entity_1.Fan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        celebrity_service_1.CelebrityService])
], FanService);
//# sourceMappingURL=fan.service.js.map