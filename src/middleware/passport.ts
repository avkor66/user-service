import { PassportStatic } from 'passport';
import { Strategy as JwtStrategy } from "passport-jwt";
import { User } from '../models/User.js';
import {IAuthUserJWT} from "../interfaces/IUser.js";

const configurePassport = (passport: PassportStatic) => {
    const options = {
        jwtFromRequest: (req: any) => {
            return req && req.cookies ? req.cookies.auth_token : null;
        },
        secretOrKey: process.env.JWT_SECRET!
    };

    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await User.findById(payload.userId).select('email id role');
                if (user) {
                    const authUser: IAuthUserJWT = { id: user.id, email: user.email, role: user.role };
                    return done(null, authUser);
                } else {
                    return done(null, false);
                }
            } catch (error) {
                return done(error, false);
            }
        })
    );
};

export default configurePassport;