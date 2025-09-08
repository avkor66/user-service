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
}