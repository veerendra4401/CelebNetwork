import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Celebrity } from './entities/celebrity.entity';
import { CelebrityService } from './celebrity.service';
import { CelebrityController } from './celebrity.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Celebrity]),
    ConfigModule,
  ],
  providers: [CelebrityService],
  controllers: [CelebrityController],
  exports: [CelebrityService],
})
export class CelebrityModule {} 