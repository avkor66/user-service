import {Request as Req, Response as Res} from "express";
import {UserService} from "../services/UserService.ts";

export class AuthController {
    static async authSignin(req: Req, res: Res) {

        try {
            const authData = req.body;

            const user = await UserService.findByEmail(authData.email);
            if (!user) {
                return res.status(400).json({ error: 'Email не найден' });
            }

            res.status(201).json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Неизвестная ошибка' });
            }
        }
        res.status(200).json("Вы удачно авторизовались");
    }
}