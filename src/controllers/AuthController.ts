import { Request, Response } from "express";
import { User } from '../models/User.js';
import { UserService } from "../services/UserService.js";
import {IAuthUser, IUser, IUserCreate} from "../interfaces/IUser.js";
import jwt from  "jsonwebtoken";
import {config} from "../config/config.js";

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
            const token: String = jwt.sign({userId: user.id,}, config.JWT_SECRET!, {expiresIn:60*60*24});
            const refreshToken = jwt.sign({id: user.id}, config.JWT_REFRESH_SECRET!, {expiresIn:"7d"}
            );

            res.cookie("auth_token", token, {
                secure: false,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            });
            res.cookie("refresh_token", refreshToken, {
                secure: false,
                sameSite: "strict",
                maxAge: 14 * 24 * 60 * 60 * 1000
            });
            res.status(200).json({
                success: true,
                message: 'Login successful',
                auth_token: token,
                refresh_token: refreshToken,
                user: {
                    id: user.id,
                    name: user.firstName,
                    email: user.email
                }
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

            const payload = jwt.verify(refresh_token, config.JWT_REFRESH_SECRET!) as any;
            const token: String = jwt.sign({userId: payload.id}, config.JWT_SECRET!, {expiresIn:60*60*24});
            const refreshToken = jwt.sign({id: payload.id}, config.JWT_REFRESH_SECRET!, {expiresIn:"7d"});

            res.cookie("auth_token", token, {
                secure: false,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            });

            res.cookie("refresh_token", refreshToken, {
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
            console.log('emailExists');
            console.log(emailExists);
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
            const user: IUser = await UserService.createUser(userData);
            return res.status(201).json({
                success: true,
                message: 'User created',
                user: {
                    id: user.id,
                    name: user.firstName,
                    email: user.email
                }
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

    static async authRegister(req: Request, res: Response) {

        try {
            const userData: IUserCreate = {
                lastName: 'none',
                firstName: req.body.name,
                middleName: ' ',
                birthDate: new Date(2002,2, 1 ),
                email: req.body.email,
                password: req.body.password,
                role: 'user'
            };

            const emailExists = await UserService.isEmailExists(userData.email);

            if (emailExists) {
                res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
            const user: IUser = await UserService.createUser(userData);
            console.log(user);
            res.status(201).json({
                success: true,
                message: 'User created',
                user: {
                    id: user.id,
                    name: user.firstName,
                    email: user.email
                }
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

    static async authLogin(req: Request, res: Response) {

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
            const token: String = jwt.sign({userId: user.id,}, config.JWT_SECRET!, {expiresIn:60*60*24});
            const refreshToken = jwt.sign({id: user.id}, config.JWT_REFRESH_SECRET!, {expiresIn:"7d"}
            );

            // res.cookie("auth_token", token, {
            //     secure: false,
            //     sameSite: "strict",
            //     maxAge: 24 * 60 * 60 * 1000
            // });
            // res.cookie("refresh_token", refreshToken, {
            //     secure: false,
            //     sameSite: "strict",
            //     maxAge: 14 * 24 * 60 * 60 * 1000
            // });
            res.status(200).json({
                success: true,
                message: 'Login successful',
                auth_token: token,
                refresh_token: refreshToken,
                user: {
                    id: user.id,
                    name: user.firstName,
                    email: user.email
                }
            });

        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
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

    static async passwordForgot(req: Request, res: Response) {

        try {
            await UserService.passwordForgot(req.body.email);
            return res.status(200).json({success: true, message: 'На электронную почту отправлена инструкция по восстановлению пароля'});
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
    static async passwordReset(req: Request, res: Response) {

        try {
            console.log('passwordReset');
            console.log(req.body);
            // console.log(req.params.token)
            const password = req.body.password
            const token = req.body.token || req.params.token;

            const decode = await UserService.checkJwtToken(token);

            console.log(decode);
            if (!decode.success) {
                return res.status(403).json({success: false, message: decode.message});
            }

            const email =  decode.email;

            const user = await User.findOne({email})
            if (user) {
                user.set('password', password);
                user.markModified('password');
                await user.save()
                return res.status(200).json({success: true, message: 'Пароль успешно сброшен'});

            }
            return res.status(404).json({success: false, message: 'Пользователь не найден'});

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