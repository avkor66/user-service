import {User} from '../models/User.js';
import {IUser, IUserCreate, IUsersAdmin, IUserUpdate} from '../interfaces/IUser.js';
import {Types} from 'mongoose';
import jwt, {JwtPayload} from "jsonwebtoken";
import nodemailer from 'nodemailer'


interface IToken {
    email: string;
    iat: number;
    exp: number;
}



export class UserService {
    static async createUser(userData: IUserCreate) {
        const user = new User(userData)
        return await user.save();
    }
    static async findById(id: string) {
        return await User.findById(id);
    }
    static async getAllUsers(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find().skip(skip).limit(limit),
            User.countDocuments()
        ]);

        return {
            users,
            total,
            pages: Math.ceil(total / limit),
            page: page
        };
    }
    static async updateUser(id: string, updateUserData: IUserUpdate) {
        return await User.findByIdAndUpdate(id, updateUserData, {new: true, runValidators: false});
    }
    static async deleteUser(id: string) {
        return await User.findByIdAndUpdate(
            id,
            { $set: { isActive: false } },
            { new: true }
        );
    }
    static async activateUser(id: string) {
        return await User.findByIdAndUpdate(
            id,
            { $set: { isActive: true } },
            { new: true }
        );
    }
    static async inactivateUser(id: string) {
        return await User.findByIdAndUpdate(
            id,
            { $set: { isActive: false } },
            { new: true }
        );
    }
    static async isEmailExists(email: string, excludeUserId?: string) {
        const query: any = { email: email.toLowerCase() };
        if (excludeUserId) {
            query._id = { $ne: new Types.ObjectId(excludeUserId) };
        }
        return await User.exists(query);
    }
    static usersEditorForAdmin(user: IUser): IUsersAdmin {
        return {
            fullName: `${user.lastName} ${user.firstName} ${user.middleName}`,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            id: user._id as string
        }
    }
    static async passwordForgot(email: string) {
        const token = jwt.sign({email}, `${process.env.USER_SERVICE_SECRET}`, {expiresIn: '1h'})

        const link = `${process.env.FRONTEND_CLIENT_URL}/password-reset/${token}`

        const transporter = nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            }
        });

        try {
            await transporter.sendMail({
                from: '"msametiz96.ru: Восстановление пароля" <a131010@mail.ru>',
                to: email,
                subject: "Восстановление пароля",
                text: `Для восстановления пароля перейдите по ссылке: ${link} и введите новый пароль`,
            });

        } catch (error){
            console.log(error)
        }
    }

    static async checkJwtToken(token: string) {
        try {
            const tokenVerify = jwt.verify(token, `${process.env.USER_SERVICE_SECRET}`);
            console.log(tokenVerify);
            if (tokenVerify && typeof tokenVerify === 'object') {
                return {success: true, message: 'Токен действительный', email: tokenVerify.email};
            }
                return {success: false, message: 'Что-то пошло не так при проверке'}
        } catch (error){
            if (error instanceof Error) {
                if (Object.hasOwn(error, 'expiredAt')) {
                    return {success: false, message: 'Срок действия токена истек'};
                } else if (error.message.includes('invalid signature')) {
                    return {success: false, message: 'Токен не действительный'};
                } else {
                    return {success: false, message: 'Ошибка токена'}
                }
            } else {
                return {success: false, message: 'Неизвестная ошибка'};
            }
        }
    }

}