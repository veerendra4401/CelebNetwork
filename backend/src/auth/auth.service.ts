import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FanService } from '../fan/fan.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly fanService: FanService,
    private readonly jwtService: JwtService,
  ) {}

  async validateFan(email: string, password: string) {
    try {
      const fan = await this.fanService.findByEmail(email);
      const isPasswordValid = await bcrypt.compare(password, fan.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return fan;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw error;
    }
  }

  async login(email: string, password: string) {
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

  async register(createFanDto: any) {
    try {
      await this.fanService.findByEmail(createFanDto.email);
      throw new ConflictException('Email already registered');
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Email not found, proceed with registration
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
} 