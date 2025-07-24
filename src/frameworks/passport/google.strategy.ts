import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { config } from '../../shared/config';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID!,
      clientSecret: config.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${config.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = {
          email: profile.emails?.[0]?.value,
          username: profile.displayName,
          avatar: profile.photos?.[0]?.value,
          googleId: profile.id,
        };

        return done(null, userData); 
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

// console.log("Registered strategies:", Object.keys((passport as any)._strategies));
