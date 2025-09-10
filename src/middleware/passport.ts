import { PassportStatic } from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from '../models/User.ts';
import {IAuthUser} from "../interfaces/IUser.ts";

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
                const user = await User.findById(payload.userId).select('email id');
                if (user) {
                    const authUser: IAuthUser = { id: user.id, email: user.email };
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