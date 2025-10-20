import {Request, Response} from 'express';
import { UserService } from '../services/UserService.js';
import {IAuthUserJWT, IUser, IUserCreate, IUsersAll, IUserUpdate} from "../interfaces/IUser.js";
import {User} from "../models/User.js";
import {ProfileService} from "../services/ProfileService.js";

export class UserController {

    static async getProfileAdmin(req: Request, res: Response) {
        try {
            const authUser = req.user as IAuthUserJWT;
            const userDB: IUser | null = await User.findById(authUser.id);
            if (userDB === null) {
                res.render('pages/auth/signin', {title: 'Signin'});
            }
            const users: IUsersAll = await UserService.getAllUsers()
            if (userDB === null) {
                res.render('pages/auth/signin', {title: 'Signin'});
            } else {
                res.render('pages/profile/admin', {
                    title: 'Admin',
                    admin: ProfileService.userEditorForProfile(userDB),
                    users: users.users.map((value: IUser) => UserService.usersEditorForAdmin(value)),
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

    static async createUser(req: Request, res: Response) {
        try {
            const userData: IUserCreate = emptyFieldsObjectDelete(req.body);
            const emailExists = await UserService.isEmailExists(userData.email);
            if (emailExists) {
                res.json({ success: false, message: 'Email already exists' });
            }
            const newUser = await UserService.createUser(userData);
            if (newUser) {
                res.json({ success: true, message: 'User created' });
            } else {
                res.json({ success: false, message: 'Unknown error' });
            }
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

    static async getUser(req: Request, res: Response) {
        try {
            const user: IUser | null = await UserService.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(ProfileService.userEditorForProfile(user));
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

    static async getAllUsers(req: Request, res: Response) {
        try {
            const users: IUsersAll = await UserService.getAllUsers();
            if (!users) {
                return res.status(404).json({ error: 'Users not found' });
            }
            res.json(users);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const authUser = req.user as IAuthUserJWT;
            const newDataUser: IUserUpdate = emptyFieldsObjectDelete(req.body);
            const user: IUser | null = await UserService.updateUser(authUser.id, newDataUser);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.redirect('/profile/edit');
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }
    static async updateUserSettings(req: Request, res: Response) {
        try {
            const authUser = req.user as IAuthUserJWT;
            const newDataUser: IUserUpdate = emptyFieldsObjectDelete(req.body);
            const user: IUser | null = await UserService.updateUser(authUser.id, newDataUser);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(202).json({
                success: true,
                message: 'Settings updated successfully'
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }


    static async deleteUser(req: Request, res: Response) {
        try {
            const removeUser = req.user as IAuthUserJWT;
            const user: IUser | null = await UserService.deleteUser(removeUser.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({
                status: 'success',
                message: 'User deleted'
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

    static async activateUser(req: Request, res: Response) {
        try {
            const user: IUser | null = await UserService.activateUser(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ id: user._id, isActive: user.isActive, email: user.email });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

    static async inactivateUser(req: Request, res: Response) {
        try {
            const user: IUser | null = await UserService.inactivateUser(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ id: user._id, isActive: user.isActive, email: user.email });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

}

function emptyFieldsObjectDelete(obj: any): any {
    return Object.keys(obj).reduce((acc, key) => {
        if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
            acc[key] = obj[key];
        }
        return acc;
    }, {} as any);
}