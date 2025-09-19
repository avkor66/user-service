import { Request, Response} from 'express';
import {User} from "../models/User.js";
import {IAuthUserJWT, IUser} from "../interfaces/IUser.js";
import {ProfileService} from "../services/ProfileService.js";

export class ProfileController {
    static async getProfileMe(req: Request, res: Response) {
        try {
            const authUserJwt = req.user as IAuthUserJWT;
            const userDB: IUser | null = await User.findById(authUserJwt.id)
            if (userDB === null) {
                res.status(400).json({
                    success: false,
                    message: 'Unknown user'
                });
            } else {
                res.status(200).json(userDB);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Неизвестная ошибка' });
            }
        }
    }
    static async getProfileData(req: Request, res: Response) {
        try {
            const authUserJwt = req.user as IAuthUserJWT;
            const userDB: IUser | null = await User.findById(authUserJwt.id)
            if (userDB === null) {
                res.render('pages/auth/signin', {title: 'Signin'});
            } else {
                res.render('pages/profile/profile', {
                    title: 'Profile',
                    user: ProfileService.userEditorForProfile(userDB),
                })
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Неизвестная ошибка' });
            }
        }
    }
    static async getProfileDataForEdit(req: Request, res: Response) {
        try {
            const authUserJwt = req.user as IAuthUserJWT;
            const userDB: IUser | null = await User.findById(authUserJwt.id)
            if (userDB === null) res.render('pages/auth/signin', {title: 'Signin'});
            else {
                res.render('pages/profile/edit', {
                    title: 'Edit profile',
                    user: ProfileService.userEditorForProfile(userDB),
                })
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Неизвестная ошибка' });
            }
        }
    }
}