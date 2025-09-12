import {NextFunction, Request, Response} from "express";
import {IAuthUserJWT} from "../interfaces/IUser.ts";

export class IsAdmin {
    static isAdmin(req: Request, res: Response, next: NextFunction) {
        const user = req.user as IAuthUserJWT;
        if (user.role === 'admin') {
            return next();
        }
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
}