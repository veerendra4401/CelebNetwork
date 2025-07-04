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
exports.CelebrityController = void 0;
const common_1 = require("@nestjs/common");
const celebrity_service_1 = require("./celebrity.service");
const swagger_1 = require("@nestjs/swagger");
let CelebrityController = class CelebrityController {
    celebrityService;
    constructor(celebrityService) {
        this.celebrityService = celebrityService;
    }
    async suggestCelebrities(description) {
        try {
            if (!description || description.trim().length === 0) {
                throw new common_1.HttpException('Search description is required', common_1.HttpStatus.BAD_REQUEST);
            }
            console.log('Controller: Received search request for:', description);
            const results = await this.celebrityService.suggestCelebrities(description);
            console.log('Controller: Received results:', results);
            if (!results || results.length === 0) {
                return [];
            }
            return results;
        }
        catch (error) {
            console.error('Controller Error:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to search celebrities', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async autoFillCelebrityDetails(name) {
        return this.celebrityService.autoFillCelebrityDetails(name);
    }
    async create(createCelebrityDto) {
        return this.celebrityService.create(createCelebrityDto);
    }
    async findAll() {
        return this.celebrityService.findAll();
    }
    async findOne(id) {
        return this.celebrityService.findOne(id);
    }
    async update(id, updateCelebrityDto) {
        return this.celebrityService.update(id, updateCelebrityDto);
    }
    async remove(id) {
        return this.celebrityService.remove(id);
    }
};
exports.CelebrityController = CelebrityController;
__decorate([
    (0, common_1.Get)('suggest'),
    (0, swagger_1.ApiOperation)({ summary: 'Search celebrities using AI' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of potential celebrity matches' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Query)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CelebrityController.prototype, "suggestCelebrities", null);
__decorate([
    (0, common_1.Get)('autofill/:name'),
    (0, swagger_1.ApiOperation)({ summary: 'Auto-fill celebrity details using AI' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns pre-filled celebrity details' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CelebrityController.prototype, "autoFillCelebrityDetails", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new celebrity' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Celebrity created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CelebrityController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all celebrities' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of all celebrities' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CelebrityController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get celebrity by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns celebrity details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CelebrityController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update celebrity details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Celebrity updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CelebrityController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete celebrity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Celebrity deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CelebrityController.prototype, "remove", null);
exports.CelebrityController = CelebrityController = __decorate([
    (0, swagger_1.ApiTags)('celebrities'),
    (0, common_1.Controller)('celebrities'),
    __metadata("design:paramtypes", [celebrity_service_1.CelebrityService])
], CelebrityController);
//# sourceMappingURL=celebrity.controller.js.map