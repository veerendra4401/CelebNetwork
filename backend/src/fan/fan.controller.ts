import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { FanService } from './fan.service';
import { Fan } from './entities/fan.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CelebrityService } from '../celebrity/celebrity.service';

@ApiTags('fans')
@Controller('fans')
export class FanController {
  constructor(
    private readonly fanService: FanService,
    private readonly celebrityService: CelebrityService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new fan account' })
  @ApiResponse({ status: 201, description: 'Fan account created successfully' })
  async create(@Body() createFanDto: Partial<Fan>) {
    return this.fanService.create(createFanDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all fans' })
  @ApiResponse({ status: 200, description: 'Returns list of all fans' })
  async findAll() {
    return this.fanService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get fan by ID' })
  @ApiResponse({ status: 200, description: 'Returns fan details' })
  @ApiResponse({ status: 404, description: 'Fan not found' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.fanService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Get(':id/following')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get celebrities followed by fan' })
  @ApiResponse({ status: 200, description: 'Returns list of followed celebrities' })
  @ApiResponse({ status: 404, description: 'Fan not found' })
  async getFollowedCelebrities(@Param('id') id: string) {
    try {
      const fan = await this.fanService.findOne(id);
      return fan.followedCelebrities || [];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update fan details' })
  @ApiResponse({ status: 200, description: 'Fan updated successfully' })
  @ApiResponse({ status: 404, description: 'Fan not found' })
  async update(
    @Param('id') id: string,
    @Body() updateFanDto: Partial<Fan>,
  ) {
    try {
      return await this.fanService.update(id, updateFanDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete fan account' })
  @ApiResponse({ status: 200, description: 'Fan deleted successfully' })
  @ApiResponse({ status: 404, description: 'Fan not found' })
  async remove(@Param('id') id: string) {
    try {
      await this.fanService.remove(id);
      return { message: 'Fan deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Post(':fanId/follow/:celebrityId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Follow a celebrity' })
  @ApiResponse({ status: 200, description: 'Successfully followed celebrity' })
  @ApiResponse({ status: 404, description: 'Fan or celebrity not found' })
  async followCelebrity(
    @Param('fanId') fanId: string,
    @Param('celebrityId') celebrityId: string,
  ) {
    try {
      const celebrity = await this.celebrityService.findOne(celebrityId);
      if (!celebrity) {
        throw new NotFoundException(`Celebrity with ID "${celebrityId}" not found`);
      }
      return await this.fanService.followCelebrity(fanId, celebrity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Delete(':fanId/unfollow/:celebrityId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Unfollow a celebrity' })
  @ApiResponse({ status: 200, description: 'Successfully unfollowed celebrity' })
  @ApiResponse({ status: 404, description: 'Fan or celebrity not found' })
  async unfollowCelebrity(
    @Param('fanId') fanId: string,
    @Param('celebrityId') celebrityId: string,
  ) {
    try {
      return await this.fanService.unfollowCelebrity(fanId, celebrityId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Get(':id/dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get fan dashboard' })
  @ApiResponse({ status: 200, description: 'Returns fan dashboard data' })
  @ApiResponse({ status: 404, description: 'Fan not found' })
  async getDashboard(@Param('id') id: string) {
    try {
      return await this.fanService.getDashboard(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Put(':id/settings')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update fan settings' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  @ApiResponse({ status: 404, description: 'Fan not found' })
  async updateSettings(
    @Param('id') id: string,
    @Body() updateSettingsDto: any
  ) {
    try {
      return await this.fanService.updateSettings(id, updateSettingsDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Get(':id/notifications')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get fan notifications' })
  @ApiResponse({ status: 200, description: 'Returns list of notifications' })
  @ApiResponse({ status: 404, description: 'Fan not found' })
  async getNotifications(@Param('id') id: string) {
    try {
      return await this.fanService.getNotifications(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Put(':id/notifications/:notificationId/read')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 404, description: 'Fan or notification not found' })
  async markNotificationAsRead(
    @Param('id') id: string,
    @Param('notificationId') notificationId: string,
  ) {
    try {
      return await this.fanService.markNotificationAsRead(id, notificationId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }
} 