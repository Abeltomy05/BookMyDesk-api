import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
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
