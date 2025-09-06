import { Request as Req, Response as Res } from 'express';
import { UserService } from '../services/UserService';

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
}