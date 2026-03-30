
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User, Role } from '../models/index.js';
import dotenv from 'dotenv';
import { generateToken } from '../utils/jwt.js';

dotenv.config();

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.APP_URL || 'http://localhost:5000'}/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // 1. Check if user already exists with this googleId
            let user = await User.findOne({ where: { googleId: profile.id } });

            if (user) {
                return done(null, user);
            }

            // 2. Check if user exists with the same email
            const email = profile.emails[0].value;
            user = await User.findOne({ where: { email } });

            if (user) {
                // Link googleId to existing user
                user.googleId = profile.id;
                await user.save();
                return done(null, user);
            }

            // 3. Create new user
            user = await User.create({
                name: profile.displayName,
                email: email,
                googleId: profile.id,
                password: await import('bcryptjs').then(bcrypt => bcrypt.hash(Math.random().toString(36).slice(-8), 10)), // Random password
                phone: null 
            });

            // Assign default role
            const userRole = await Role.findOne({ where: { name: 'user' } });
            if (userRole) {
                await user.addRole(userRole);
            }

            return done(null, user);

        } catch (error) {
            console.error('Passport Google Strategy Error:', error);
            return done(error, null);
        }
    }
    ));
} else {
    console.warn("⚠️ Google Auth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) are missing. Google Auth will be disabled.");
}

// Serialize user for session (or token generation in route)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
