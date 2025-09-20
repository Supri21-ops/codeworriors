import { LoginDto, SignupDto } from './dto';
export declare class AuthService {
    signup(data: SignupDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
        user: any;
    }>;
    login(data: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
        user: any;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    verifyToken(token: string): Promise<any>;
}
//# sourceMappingURL=auth.service.d.ts.map