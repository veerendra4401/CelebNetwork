import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CelebrityModule } from './celebrity/celebrity.module';
import { FanModule } from './fan/fan.module';
import { AuthModule } from './auth/auth.module';
import { PdfModule } from './pdf/pdf.module';
import configuration from './config/configuration';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [
        path.resolve(__dirname, '../config/development.env'),
        '.env'
      ],
    }),
    DatabaseModule,
    CelebrityModule,
    FanModule,
    AuthModule,
    PdfModule,
  ],
})
export class AppModule {}
