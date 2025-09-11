import { Request, Response } from "express";
import { User } from '../models/User.ts';
import { UserService } from "../services/UserService.ts";
import {IAuthUser, IUser, IUserCreate} from "../interfaces/IUser.ts";
import jwt from  "jsonwebtoken";

export class AuthController {

    static async authRenderSignup(req: Request, res: Response) {

        try {
            res.render('pages/auth/signup', { title: 'Signup' });
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

    static async authRenderSignin(req: Request, res: Response) {

        try {
            res.render('pages/auth/signin', { title: 'Signin' });
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

    static async authSignin(req: Request, res: Response) {

        try {
            const authData: IAuthUser = req.body;
            const user: IUser | null = await User.findOne({ email: authData.email.toLowerCase() });
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
            const isPasswordValid: Boolean = await user.comparePassword(authData.password);
            if (!isPasswordValid) {
                res.status(400).json({
                    success: false,
                    message: 'Password incorrect',
                });
            }
            const token: String = jwt.sign({
                email: user.email,
                userId: user._id
            }, process.env.JWT_SECRET!, {expiresIn: 60 * 60 * 24});

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: false,
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

    static async authSignup(req: Request, res: Response) {

        try {
            const userData: IUserCreate = req.body;
            const emailExists = await UserService.isEmailExists(userData.email);
            if (emailExists) {
                res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
            const user: IUser = await UserService.createUser(userData);
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

    static async logout(req: Request, res: Response) {

        try {
            res.clearCookie("auth_token", {
                httpOnly: true,
                secure: false,
                sameSite: "strict"
            });
            res.render('pages/success', {
                title: 'Logout!',
                heading: 'Logout user.',
                message: 'You have logged out of your profile.',
                path: '/',
                time: 1
            })
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