import { Request as Req, Response as Res } from 'express';
import {User} from "../models/User.ts";
import {IAuthUser, IUser} from "../interfaces/IUser.ts";
import {UserService} from "../services/UserService.ts";

const timeCorrect = (time: number): string => {
    return time < 10 ? '0' + time.toString() : time.toString();
};
const dateEditor = (date: Date, flag: boolean): string => {
    const newDate = `${timeCorrect(date.getDate())}.${timeCorrect(date.getMonth() + 1)}.${date.getFullYear()}`
    if (flag) {
        const newTime = `${timeCorrect(date.getHours())}:${timeCorrect(date.getMinutes() + 1)}:${timeCorrect(date.getSeconds())}`
        return newDate + ' ' + newTime;
    } else {
        return newDate;
    }
}

export class ProfileController {
    static async getProfileData(req: Req, res: Res) {
        try {
            const authUser = req.user as IAuthUser;
            const userDB = await User.findById(authUser.id)
            if (userDB === null) {
                res.render('pages/auth/signin');
            } else {
                const user = {
                    lastName: userDB.lastName,
                    firstName: userDB.firstName,
                    middleName: userDB.middleName || '',
                    birthDate: userDB.birthDate,
                    email: userDB.email,
                    role: userDB.role,
                    isActive: userDB.isActive,
                    createdAt: userDB.createdAt,
                    updatedAt: userDB.updatedAt
                } as IUser;
                res.render('pages/profile/profile', {
                    fullName: `${user.lastName} ${user.firstName} ${user.middleName}`,
                    birthDate: dateEditor(user.birthDate, false),
                    email: user.email,
                    role: user.role,
                    isAdmin: user.role === 'admin',
                    isActive: user.isActive,
                    createdAt: dateEditor(user.createdAt, true),
                })
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Неизвестная ошибка' });
            }
        }
    }
    static async getProfileDataForEdit(req: Req, res: Res) {
        try {
            const authUser = req.user as IAuthUser;
            const userDB = await User.findById(authUser.id)
            if (userDB === null) {
                res.render('pages/auth/signin');
            } else {
                const user = {
                    lastName: userDB.lastName,
                    firstName: userDB.firstName,
                    middleName: userDB.middleName || '',
                    birthDate: userDB.birthDate,
                    email: userDB.email,
                    role: userDB.role,
                    isActive: userDB.isActive,
                    createdAt: userDB.createdAt,
                    updatedAt: userDB.updatedAt
                } as IUser;
                res.render('pages/profile/edit', {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    middleName: user.middleName || '',
                    birthDate: dateEditor(user.birthDate, false),
                    email: user.email,
                    role: user.role,
                    isAdmin: user.role === 'admin',
                    isActive: user.isActive,
                    createdAt: dateEditor(user.createdAt, true),
                })
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Неизвестная ошибка' });
            }
        }
    }
    static async getProfileAdmin(req: Req, res: Res) {
        try {
            const authUser = req.user as IAuthUser;
            const userDB = await User.findById(authUser.id)
            const users = await UserService.getAllUsers()
            const newUsers = users.users.map(user => {
                return {
                    fullName: `${user.firstName} ${user.lastName} ${user.middleName}`,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive,
                    id: user._id as string,
                }
            });
            if (userDB === null) {
                res.render('pages/auth/signin');
            } else {
                const user = {
                    lastName: userDB.lastName,
                    firstName: userDB.firstName,
                    middleName: userDB.middleName || '',
                    birthDate: userDB.birthDate,
                    email: userDB.email,
                    role: userDB.role,
                    isActive: userDB.isActive,
                    createdAt: userDB.createdAt,
                    updatedAt: userDB.updatedAt
                };
                res.render('pages/profile/admin', {
                    admin: {
                        fullName: `${user.firstName} ${user.lastName} ${user.middleName}`,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        middleName: user.middleName || '',
                        birthDate: dateEditor(user.birthDate, false),
                        email: user.email,
                        role: user.role,
                        isAdmin: user.role === 'admin',
                        isActive: user.isActive,
                        createdAt: dateEditor(user.createdAt, true)},
                    users: newUsers,

                })
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Неизвестная ошибка' });
            }
        }
    }
}