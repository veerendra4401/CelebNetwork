"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./database/database.module");
const celebrity_module_1 = require("./celebrity/celebrity.module");
const fan_module_1 = require("./fan/fan.module");
const auth_module_1 = require("./auth/auth.module");
const pdf_module_1 = require("./pdf/pdf.module");
const configuration_1 = require("./config/configuration");
const path = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                envFilePath: [
                    path.resolve(__dirname, '../config/development.env'),
                    '.env'
                ],
            }),
            database_module_1.DatabaseModule,
            celebrity_module_1.CelebrityModule,
            fan_module_1.FanModule,
            auth_module_1.AuthModule,
            pdf_module_1.PdfModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map