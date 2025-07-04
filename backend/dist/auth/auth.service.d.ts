import { JwtService } from '@nestjs/jwt';
import { FanService } from '../fan/fan.service';
export declare class AuthService {
    private readonly fanService;
    private readonly jwtService;
    constructor(fanService: FanService, jwtService: JwtService);
    validateFan(email: string, password: string): Promise<import("../fan/entities/fan.entity").Fan>;
    login(email: string, password: string): Promise<{
        access_token: string;
        fan: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    register(createFanDto: any): Promise<{
        access_token: string;
        fan: {
            id: string;
            email: string;
            name: string;
        };
    }>;
}
