export interface AuthUser {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role?: string | null;
}
