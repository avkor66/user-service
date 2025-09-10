import { Request as Req, Response as Res } from "express";
import { User } from '../models/User.ts';
import { UserService } from "../services/UserService.ts";
import { IUserCreate } from "../interfaces/IUser.ts";
import jwt from  "jsonwebtoken";

function emptyFieldsObjectDelete(obj: any): any {
    return Object.keys(obj).reduce((acc, key) => {
        if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
            acc[key] = obj[key];
        }
        return acc;
    }, {} as any);
}

export class AuthController {

    static async authSignin(req: Req, res: Res) {

        try {
            const authData = req.body;
            const user = await User.findOne({ email: authData.email });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Email not found'
                });
            }
            if (!user.isActive) {
                res.status(400).json({
                    success: false,
                    message: 'The user is inactive',
                });
            }

            const isPasswordValid = await user.comparePassword(authData.password);
            if (!isPasswordValid) {
                res.status(400).json({
                    success: false,
                    message: 'Password incorrect',
                });
            }

            const token = jwt.sign({
                email: user.email,
                userId: user._id
            }, process.env.JWT_SECRET!, {expiresIn: 60 * 60 * 24});

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: false, // true для HTTPS
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            });
            res.status(200).json({
                success: true,
                message: 'Login successful',
            });

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
            const userData: IUserCreate = emptyFieldsObjectDelete(req.body);
            const emailExists = await UserService.isEmailExists(userData.email);
            if (emailExists) {
                res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
            const user = await UserService.createUser(userData);
            res.status(201).json({
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

}