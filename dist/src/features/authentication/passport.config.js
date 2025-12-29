var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { retrieveUserFromDatabaseById } from '../users/users-model.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// Local Strategy removed as we are using Google Auth only
// JWT Strategy for route protection
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
}, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userTask = retrieveUserFromDatabaseById(payload.id);
        const result = yield userTask();
        if (result._tag === 'Left') {
            return done(result.left, false);
        }
        const user = result.right;
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
    catch (err) {
        return done(err, false);
    }
})));
export default passport;
