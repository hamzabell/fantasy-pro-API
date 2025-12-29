import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { retrieveUserFromDatabaseById } from '../users/users-model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


// Local Strategy removed as we are using Google Auth only


// JWT Strategy for route protection
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const userTask = retrieveUserFromDatabaseById(payload.id);
        const result = await userTask();

        if (result._tag === 'Left') {
             return done(result.left, false);
        }

        const user = result.right;
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;
