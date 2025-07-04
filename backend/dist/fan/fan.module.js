"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fan_entity_1 = require("./entities/fan.entity");
const notification_entity_1 = require("./entities/notification.entity");
const fan_service_1 = require("./fan.service");
const fan_controller_1 = require("./fan.controller");
const celebrity_module_1 = require("../celebrity/celebrity.module");
let FanModule = class FanModule {
};
exports.FanModule = FanModule;
exports.FanModule = FanModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([fan_entity_1.Fan, notification_entity_1.Notification]),
            celebrity_module_1.CelebrityModule,
        ],
        controllers: [fan_controller_1.FanController],
        providers: [fan_service_1.FanService],
        exports: [fan_service_1.FanService],
    })
], FanModule);
//# sourceMappingURL=fan.module.js.map