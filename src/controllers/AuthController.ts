import { Request, Response } from "express";
import { User } from '../models/User.js';
import { UserService } from "../services/UserService.js";
import {IAuthUser, IUser, IUserCreate} from "../interfaces/IUser.js";
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
            const token: String = jwt.sign({userId: user.id,}, process.env.JWT_SECRET!, {expiresIn:60*60*24});
            const refreshToken = jwt.sign({id: user.id}, process.env.JWT_REFRESH_SECRET!, {expiresIn:"7d"}
            );

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            });
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 14 * 24 * 60 * 60 * 1000
            });
            res.status(200).json({
                success: true,
                message: 'Login successful',
                auth_token: token,
                refresh_token: refreshToken
            });

        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }

    }

    static async authRefreshToken(req: Request, res: Response) {

        try {

            const refresh_token = req.body.refresh_token;

            if (!refresh_token) {
                return res.status(401).json({ message: "Refresh token required" });
            }

            const payload = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET!) as any;
            const token: String = jwt.sign({userId: payload.id}, process.env.JWT_SECRET!, {expiresIn:60*60*24});
            const refreshToken = jwt.sign({id: payload.id}, process.env.JWT_REFRESH_SECRET!, {expiresIn:"7d"});

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            });

            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 14 * 24 * 60 * 60 * 1000
            });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                auth_token: token,
                refresh_token: refreshToken
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
            res.clearCookie("refresh_token", {
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