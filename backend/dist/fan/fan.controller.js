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
exports.FanController = void 0;
const common_1 = require("@nestjs/common");
const fan_service_1 = require("./fan.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const celebrity_service_1 = require("../celebrity/celebrity.service");
let FanController = class FanController {
    fanService;
    celebrityService;
    constructor(fanService, celebrityService) {
        this.fanService = fanService;
        this.celebrityService = celebrityService;
    }
    async create(createFanDto) {
        return this.fanService.create(createFanDto);
    }
    async findAll() {
        return this.fanService.findAll();
    }
    async findOne(id) {
        try {
            return await this.fanService.findOne(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }
    async getFollowedCelebrities(id) {
        try {
            const fan = await this.fanService.findOne(id);
            return fan.followedCelebrities || [];
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }
    async update(id, updateFanDto) {
        try {
            return await this.fanService.update(id, updateFanDto);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }
    async remove(id) {
        try {
            await this.fanService.remove(id);
            return { message: 'Fan deleted successfully' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }
    async followCelebrity(fanId, celebrityId) {
        try {
            const celebrity = await this.celebrityService.findOne(celebrityId);
            if (!celebrity) {
                throw new common_1.NotFoundException(`Celebrity with ID "${celebrityId}" not found`);
            }
            return await this.fanService.followCelebrity(fanId, celebrity);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }
    async unfollowCelebrity(fanId, celebrityId) {
        try {
            return await this.fanService.unfollowCelebrity(fanId, celebrityId);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }
    async getDashboard(id) {
        try {
            return await this.fanService.getDashboard(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }
    async updateSettings(id, updateSettingsDto) {
        try {
            return await this.fanService.updateSettings(id, updateSettingsDto);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }
    async getNotifications(id) {
        try {
            return await this.fanService.getNotifications(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }
    async markNotificationAsRead(id, notificationId) {
        try {
            return await this.fanService.markNotificationAsRead(id, notificationId);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }
};
exports.FanController = FanController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new fan account' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Fan account created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FanController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all fans' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of all fans' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get fan by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns fan details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fan not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FanController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/following'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get celebrities followed by fan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of followed celebrities' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fan not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FanController.prototype, "getFollowedCelebrities", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update fan details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fan updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fan not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FanController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete fan account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fan deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fan not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FanController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':fanId/follow/:celebrityId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Follow a celebrity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully followed celebrity' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fan or celebrity not found' }),
    __param(0, (0, common_1.Param)('fanId')),
    __param(1, (0, common_1.Param)('celebrityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FanController.prototype, "followCelebrity", null);
__decorate([
    (0, common_1.Delete)(':fanId/unfollow/:celebrityId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Unfollow a celebrity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully unfollowed celebrity' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fan or celebrity not found' }),
    __param(0, (0, common_1.Param)('fanId')),
    __param(1, (0, common_1.Param)('celebrityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FanController.prototype, "unfollowCelebrity", null);
__decorate([
    (0, common_1.Get)(':id/dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get fan dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns fan dashboard data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fan not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FanController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Put)(':id/settings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update fan settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fan not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FanController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Get)(':id/notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get fan notifications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of notifications' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fan not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FanController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Put)(':id/notifications/:notificationId/read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Mark notification as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification marked as read' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fan or notification not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('notificationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FanController.prototype, "markNotificationAsRead", null);
exports.FanController = FanController = __decorate([
    (0, swagger_1.ApiTags)('fans'),
    (0, common_1.Controller)('fans'),
    __metadata("design:paramtypes", [fan_service_1.FanService,
        celebrity_service_1.CelebrityService])
], FanController);
//# sourceMappingURL=fan.controller.js.map