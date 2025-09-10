import { Request as Req, Response as Res } from 'express';
import { UserService } from '../services/UserService.ts';
import {IAuthUser, IUserCreate, IUserUpdate} from "../interfaces/IUser.ts";

function emptyFieldsObjectDelete(obj: any): any {
    return Object.keys(obj).reduce((acc, key) => {
        if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
            acc[key] = obj[key];
        }
        return acc;
    }, {} as any);
}

export class UserController {
    static async createUser(req: Req, res: Res) {
        try {
            const userData: IUserCreate = emptyFieldsObjectDelete(req.body);
            const emailExists = await UserService.isEmailExists(userData.email);
            if (emailExists) {
                res.json({
                    success: false,
                    message: 'Email already exists'
                });
            }
            const user = await UserService.createUser(userData);
            res.json({
                success: true,
                message: 'User created'
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Unknown error'
                });
            }
        }
    }

    static async getUser(req: Req, res: Res) {
        try {
            const user = await UserService.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            res.json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Неизвестная ошибка' });
            }
        }
    }

    static async getAllUsers(req: Req, res: Res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const users = await UserService.getAllUsers(page, limit);
            if (!users) {
                return res.status(404).json({ error: 'Пользователи не найдены' });
            }
            res.json(users);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

    static async updateUser(req: Req, res: Res) {
        try {
            const authUser = req.user as IAuthUser;
            const newDataUser: IUserUpdate = emptyFieldsObjectDelete(req.body);
            const user = await UserService.updateUser(authUser.id, newDataUser);
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            res.redirect('/profile/edit');
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

    static async deleteUser(req: Req, res: Res) {
        try {
            const removeUser = req.user as IAuthUser;
            const user = await UserService.deleteUser(removeUser.id);
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            res.status(200).json({
                status: 'success',
                message: 'User deleted'
            });

        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

    static async activateUser(req: Req, res: Res) {
        try {
            const user = await UserService.activateUser(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            res.json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

    static async inactivateUser(req: Req, res: Res) {
        try {
            const user = await UserService.inactivateUser(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            res.json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

    static async findByEmail(req: Req, res: Res) {
        try {
            const user = await UserService.findByEmail(req.params.email);
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            res.json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

    static async findByRole(req: Req, res: Res) {
        try {
            const users = await UserService.findByRole(req.params.role as 'admin' | 'user');
            if (!users) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            res.json(users);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

    static async getActiveUsers(req: Req, res: Res) {
        try {
            const users = await UserService.findActiveUsers();
            if (!users) {
                return res.status(404).json({ error: 'Активные пользователи не найдены' });
            }
            res.json(users);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

    static async getInactiveUsers(req: Req, res: Res) {
        try {
            const users = await UserService.findInactiveUsers();
            if (!users) {
                return res.status(404).json({ error: 'Неактивные пользователи не найдены' });
            }
            res.json(users);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }
}