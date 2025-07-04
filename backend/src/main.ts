import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  console.log('Environment variables loaded:', {
    OPENAI_API_KEY: configService.get('OPENAI_API_KEY') ? 'Present' : 'Missing',
    DATABASE_HOST: configService.get('DATABASE_HOST'),
  });

  // Enable CORS
  app.enableCors();

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Celebrity Fan Connect API')
    .setDescription('API documentation for the Celebrity Fan Connect platform')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('celebrities', 'Celebrity management endpoints')
    .addTag('fans', 'Fan interaction endpoints')
    .addTag('pdf', 'PDF generation endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
