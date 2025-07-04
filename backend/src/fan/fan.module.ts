import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fan } from './entities/fan.entity';
import { Notification } from './entities/notification.entity';
import { FanService } from './fan.service';
import { FanController } from './fan.controller';
import { CelebrityModule } from '../celebrity/celebrity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fan, Notification]),
    CelebrityModule,
  ],
  controllers: [FanController],
  providers: [FanService],
  exports: [FanService],
})
export class FanModule {} 