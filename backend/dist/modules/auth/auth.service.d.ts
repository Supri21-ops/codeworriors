import { LoginDto, SignupDto } from './dto';
export declare class AuthService {
    signup(data: SignupDto): Promise<{
        accessToken: never;
        refreshToken: never;
        expiresIn: string;
        user: any;
    }>;
    login(data: LoginDto): Promise<{
        accessToken: never;
        refreshToken: never;
        expiresIn: string;
        user: {
            id: any;
            email: any;
            username: any;
            firstName: any;
            lastName: any;
            role: any;
            isActive: any;
            createdAt: any;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: never;
        refreshToken: never;
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