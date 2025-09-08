import { Request as Req, Response as Res } from "express";
import { User } from '../models/User.ts';
import { UserService } from "../services/UserService.ts";
import {IUser, IUserCreate} from "../interfaces/IUser.ts";

export class AuthController {
    static async authSignin(req: Req, res: Res) {

        try {
            const authData = req.body;
            const user = await User.findOne({ email: authData.email });
            if (!user) {
                return res.status(400).json({ error: 'Email не найден' });
            }
            if (!user.isActive) {
                throw new Error('Пользователь неактивный');
            }

            const isPasswordValid = await user.comparePassword(authData.password);
            if (!isPasswordValid) {
                throw new Error('Неверный пароль');
            }
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Неизвестная ошибка' });
            }
        }
    }
    static async authSignup(req: Req, res: Res) {

        try {
            const createData: IUserCreate = req.body;
            console.log(createData);
            createData.role = 'user';
            if (await UserService.findByEmail(createData.email)) {
                return res.status(400).json({ error: 'Пользователь с таким Email уже существует' });
            }
            const user = await UserService.createUser(createData)
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Неизвестная ошибка' });
            }
        }
    }
}