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
const jwt_1 = require("@nestjs/jwt");
const fan_service_1 = require("../fan/fan.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    fanService;
    jwtService;
    constructor(fanService, jwtService) {
        this.fanService = fanService;
        this.jwtService = jwtService;
    }
    async validateFan(email, password) {
        try {
            const fan = await this.fanService.findByEmail(email);
            const isPasswordValid = await bcrypt.compare(password, fan.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            return fan;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            throw error;
        }
    }
    async login(email, password) {
        const fan = await this.validateFan(email, password);
        const payload = {
            sub: fan.id,
            email: fan.email,
            role: 'fan',
        };
        return {
            access_token: this.jwtService.sign(payload),
            fan: {
                id: fan.id,
                email: fan.email,
                name: fan.name,
            },
        };
    }
    async register(createFanDto) {
        try {
            await this.fanService.findByEmail(createFanDto.email);
            throw new common_1.ConflictException('Email already registered');
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                const fan = await this.fanService.create(createFanDto);
                const payload = {
                    sub: fan.id,
                    email: fan.email,
                    role: 'fan',
                };
                return {
                    access_token: this.jwtService.sign(payload),
                    fan: {
                        id: fan.id,
                        email: fan.email,
                        name: fan.name,
                    },
                };
            }
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [fan_service_1.FanService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map