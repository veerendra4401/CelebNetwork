import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
