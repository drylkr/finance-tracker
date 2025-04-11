export interface UserProfile {
    uid: string;
    email: string;
    emailVerified: string;
    createdAt: string;
    provider: string;
}

export interface UserState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
}

export interface UpdateProfileData {
    email?: string;
    password?: string;
    newPassword?: string;
}