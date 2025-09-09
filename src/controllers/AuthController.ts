import { Request as Req, Response as Res } from "express";
import { User } from '../models/User.ts';
import { UserService } from "../services/UserService.ts";
import { IUserCreate } from "../interfaces/IUser.ts";

export class AuthController {

    static async authSignin(req: Req, res: Res) {

        try {
            const authData = req.body;
            const user = await User.findOne({ email: authData.email });
            if (!user) {
                return res.status(400).json({ error: 'Email not found' });
            }
            if (!user.isActive) {
                throw new Error('The user is inactive');
            }

            const isPasswordValid = await user.comparePassword(authData.password);
            if (!isPasswordValid) {
                throw new Error('Incorrect password');
            }
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

    static async authSignup(req: Req, res: Res) {

        try {
            const createData: IUserCreate = req.body;
            console.log(createData);
            createData.role = 'user';
            if (await UserService.findByEmail(createData.email)) {
                return res.status(400).json({ error: 'A user with this email already exists.' });
            }
            const user = await UserService.createUser(createData)
            res.render('success', {
                title: 'Registration successful!',
                heading: 'Congratulation! Registration was successful!',
                message: 'You will be redirected to the login page.',
                path: '/signin',
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

}