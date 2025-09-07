import { Request as Req, Response as Res } from 'express';
import { UserService } from '../services/UserService.ts';

export class UserController {
    static async createUser(req: Req, res: Res) {
        try {
            const userData = req.body;

            const emailExists = await UserService.isEmailExists(userData.email);
            if (emailExists) {
                return res.status(400).json({ error: 'Email уже существует' });
            }

            const user = await UserService.createUser(userData);
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Неизвестная ошибка' });
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
            const users = await UserService.getAllUsers();
            if (!users) {
                return res.status(404).json({ error: 'Пользователи не найдены' });
            }
            res.json(users);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Неизвестная ошибка' });
            }
        }
    }

    static async updateUser(req: Req, res: Res) {
        try {
            const user = await UserService.updateUser(req.params.id, req.body);
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

    static async deleteUser(req: Req, res: Res) {
        try {
            const user = await UserService.deleteUser(req.params.id);
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
                res.status(400).json({ error: 'Неизвестная ошибка' });
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
                res.status(400).json({ error: 'Неизвестная ошибка' });
            }
        }
    }

    static async findByEmail(req: Req, res: Res) {
        try {
            const users = await UserService.findByEmail(req.params.email);
            if (!users) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            res.json(users);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Неизвестная ошибка' });
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
                res.status(400).json({ error: 'Неизвестная ошибка' });
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
                res.status(400).json({ error: 'Неизвестная ошибка' });
            }
        }
    }

    static async getInactiveUsers(req: Req, res: Res) {
        try {
            const users = await UserService.findDeactiveUsers();
            if (!users) {
                return res.status(404).json({ error: 'Деактивные пользователи не найдены' });
            }
            res.json(users);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Неизвестная ошибка' });
            }
        }
    }
}