"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    console.log('Environment variables loaded:', {
        OPENAI_API_KEY: configService.get('OPENAI_API_KEY') ? 'Present' : 'Missing',
        DATABASE_HOST: configService.get('DATABASE_HOST'),
    });
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Celebrity Fan Connect API')
        .setDescription('API documentation for the Celebrity Fan Connect platform')
        .setVersion('1.0')
        .addTag('auth', 'Authentication endpoints')
        .addTag('celebrities', 'Celebrity management endpoints')
        .addTag('fans', 'Fan interaction endpoints')
        .addTag('pdf', 'PDF generation endpoints')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map