import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fan } from './entities/fan.entity';
import { CelebrityService } from '../celebrity/celebrity.service';
import * as bcrypt from 'bcryptjs';
import { Celebrity } from '../celebrity/entities/celebrity.entity';

@Injectable()
export class FanService {
  constructor(
    @InjectRepository(Fan)
    private readonly fanRepository: Repository<Fan>,
    private readonly celebrityService: CelebrityService,
  ) {}

  async create(createFanDto: Partial<Fan>): Promise<Fan> {
    const fan = this.fanRepository.create(createFanDto);
    if (fan.password) {
      fan.password = await bcrypt.hash(fan.password, 10);
    }
    return this.fanRepository.save(fan);
  }

  async findAll(): Promise<Fan[]> {
    return this.fanRepository.find();
  }

  async findOne(id: string): Promise<Fan> {
    const fan = await this.fanRepository.findOne({
      where: { id },
      relations: ['followedCelebrities'],
    });

    if (!fan) {
      throw new NotFoundException(`Fan with ID "${id}" not found`);
    }

    return fan;
  }

  async findByEmail(email: string): Promise<Fan> {
    const fan = await this.fanRepository.findOne({
      where: { email },
      relations: ['followedCelebrities'],
    });

    if (!fan) {
      throw new NotFoundException(`Fan with email "${email}" not found`);
    }

    return fan;
  }

  async update(id: string, updateFanDto: Partial<Fan>): Promise<Fan> {
    const fan = await this.findOne(id);

    if (updateFanDto.password) {
      updateFanDto.password = await bcrypt.hash(updateFanDto.password, 10);
    }

    Object.assign(fan, updateFanDto);
    return this.fanRepository.save(fan);
  }

  async remove(id: string): Promise<void> {
    const fan = await this.findOne(id);
    await this.fanRepository.remove(fan);
  }

  async followCelebrity(fanId: string, celebrity: Celebrity): Promise<Fan> {
    const fan = await this.findOne(fanId);

    if (!fan.followedCelebrities) {
      fan.followedCelebrities = [];
    }

    // Check if already following
    const isAlreadyFollowing = fan.followedCelebrities.some(
      (c) => c.id === celebrity.id
    );

    if (isAlreadyFollowing) {
      return fan;
    }

    fan.followedCelebrities.push(celebrity);
    return this.fanRepository.save(fan);
  }

  async unfollowCelebrity(fanId: string, celebrityId: string): Promise<Fan> {
    const fan = await this.findOne(fanId);

    const initialLength = fan.followedCelebrities.length;
    fan.followedCelebrities = fan.followedCelebrities.filter(
      (celebrity) => celebrity.id !== celebrityId
    );

    if (initialLength === fan.followedCelebrities.length) {
      throw new NotFoundException(`Celebrity with ID "${celebrityId}" not found in followed list`);
    }

    return this.fanRepository.save(fan);
  }

  async getDashboard(fanId: string): Promise<{
    followedCelebrities: Celebrity[];
    totalFollowing: number;
  }> {
    const fan = await this.findOne(fanId);
    
    return {
      followedCelebrities: fan.followedCelebrities,
      totalFollowing: fan.followedCelebrities.length,
    };
  }

  async updateSettings(id: string, updateSettingsDto: any): Promise<Fan> {
    const fan = await this.findOne(id);
    
    // Update basic info
    if (updateSettingsDto.name) {
      fan.name = updateSettingsDto.name;
    }
    
    // Store notification preferences in a new column if needed
    // For now, we'll just return the updated fan object
    
    return this.fanRepository.save(fan);
  }

  async getNotifications(id: string) {
    const fan = await this.fanRepository.findOne({
      where: { id },
      relations: ['notifications'],
    });

    if (!fan) {
      throw new NotFoundException(`Fan with ID "${id}" not found`);
    }

    return fan.notifications || [];
  }

  async markNotificationAsRead(fanId: string, notificationId: string) {
    const fan = await this.fanRepository.findOne({
      where: { id: fanId },
      relations: ['notifications'],
    });

    if (!fan) {
      throw new NotFoundException(`Fan with ID "${fanId}" not found`);
    }

    const notification = fan.notifications.find(n => n.id === notificationId);
    if (!notification) {
      throw new NotFoundException(`Notification with ID "${notificationId}" not found`);
    }

    notification.isRead = true;
    return this.fanRepository.save(fan);
  }
} 