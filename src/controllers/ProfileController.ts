import { Request as Req, Response as Res } from 'express';
import {User} from "../models/User.ts";
import {IAuthUser, IUser} from "../interfaces/IUser.ts";

const timeCorrect = (time: number): string => {
    return time < 10 ? '0' + time.toString() : time.toString();
};
const dateEditor = (date: Date, flag: boolean): string => {
    const newDate = `${timeCorrect(date.getDate())}.${timeCorrect(date.getMonth() + 1)}.${date.getFullYear()}`
    if (flag) {
        const newTime = `${timeCorrect(date.getHours())}:${timeCorrect(date.getMinutes() + 1)}:${date.getSeconds()}`
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
                res.render('/login');
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
                res.render('profile', {
                    fullName: `${user.lastName} ${user.firstName} ${user.middleName}`,
                    birthDate: dateEditor(user.birthDate, false),
                    email: user.email,
                    role: user.role,
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
                res.render('/login');
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
                res.render('edit', {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    middleName: user.middleName || '',
                    birthDate: dateEditor(user.birthDate, false),
                    email: user.email,
                    role: user.role,
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
    static async updateProfileUser(req: Req, res: Res) {
        try {
            console.log(req.body);
            console.log(req.params.id);
            console.log(req.user)
            res.json("Good")
            // const authUser = req.user as IAuthUser;
            // const userDB = await User.findById(authUser.id)
            // if (userDB === null) {
            //     res.render('/login');
            // } else {
            //     const user = {
            //         lastName: userDB.lastName,
            //         firstName: userDB.firstName,
            //         middleName: userDB.middleName || '',
            //         birthDate: userDB.birthDate,
            //         email: userDB.email,
            //         role: userDB.role,
            //         isActive: userDB.isActive,
            //         createdAt: userDB.createdAt,
            //         updatedAt: userDB.updatedAt
            //     } as IUser;
            //     res.render('edit', {
            //         firstName: user.firstName,
            //         lastName: user.lastName,
            //         middleName: user.middleName || '',
            //         birthDate: dateEditor(user.birthDate, false),
            //         email: user.email,
            //         role: user.role,
            //         isActive: user.isActive,
            //         createdAt: dateEditor(user.createdAt, true),
            //     })
            // }
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Неизвестная ошибка' });
            }
        }
    }
}