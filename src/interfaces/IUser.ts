import {Document} from "mongoose";

export interface IUser extends Document {
    lastName: string;
    firstName: string;
    middleName?: string;
    birthDate: Date;
    email: string;
    password: string;
    role: 'admin' | 'user';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    getFullName(): string;
}

export interface IUserCreate {
    lastName: string;
    firstName: string;
    middleName?: string;
    birthDate: Date;
    email: string;
    password: string;
    role: 'user';
}

export interface IUserUpdate {
    lastName?: string;
    firstName?: string;
    middleName?: string;
    birthDate?: Date;
    isActive?: boolean;
}

export interface IAuthUser {
    password: string;
    email: string;
}

export interface IAuthUserJWT {
    id: string;
    email: string;
    role: 'admin' | 'user';
}

export interface IUserProfile {
    fullName: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    birthDate: string;
    email: string;
    role: 'admin' | 'user';
    isAdmin: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IUsersAdmin {
    fullName: string;
    email: string;
    role: 'admin' | 'user';
    isActive: boolean;
    id: string;
}