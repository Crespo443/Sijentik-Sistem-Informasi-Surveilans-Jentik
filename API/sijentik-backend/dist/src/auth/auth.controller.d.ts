import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: {
        name: string;
        access_code: string;
        role: string;
    }): Promise<{
        access_token: string;
        user: {
            name: string;
            role: string;
            healthCenter: {
                id: string;
                createdAt: Date;
                name: string;
                headName: string | null;
                phoneNumber: string | null;
                address: string | null;
                updatedAt: Date;
                targetHouses: number;
                districtId: string;
            } | null;
        };
    }>;
}
