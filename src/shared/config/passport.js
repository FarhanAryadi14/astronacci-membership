const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');

const { User } = require('../database/models');
const logger = require('../utils/logger');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Local Strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { email: email.toLowerCase() } });

      if (!user) {
        logger.warn(`[AUTH] Login failed: User not found - ${email}`);
        return done(null, false, { message: 'Invalid email or password' });
      }

      if (user.provider !== 'local') {
        logger.warn(`[AUTH] Login failed: User registered via ${user.provider} - ${email}`);
        return done(null, false, { message: `Please login with ${user.provider}` });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.warn(`[AUTH] Login failed: Invalid password - ${email}`);
        return done(null, false, { message: 'Invalid email or password' });
      }

      logger.info(`[AUTH] Login successful: ${email}`);
      return done(null, user);
    } catch (error) {
      logger.error(`[AUTH] Login error: ${error.message}`);
      return done(error);
    }
  }
));

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          where: { provider: 'google', providerId: profile.id },
        });

        if (!user) {
          const email = profile.emails[0].value;
          
          // Check if email already exists with different provider
          const existingUser = await User.findOne({ where: { email } });

          if (existingUser) {
            // Link account - allow login with existing account
            logger.info(`[AUTH] Google login: Linking to existing account ${email} (was ${existingUser.provider})`);
            user = existingUser;
          } else {
            user = await User.create({
              email,
              name: profile.displayName,
              provider: 'google',
              providerId: profile.id,
              avatar: profile.photos[0]?.value || null,
              membershipType: 'A',
            });
            logger.info(`[AUTH] New user registered via Google: ${user.email}`);
          }
        } else {
          logger.info(`[AUTH] User logged in via Google: ${user.email}`);
        }

        return done(null, user);
      } catch (error) {
        logger.error(`[AUTH] Google auth error: ${error.message}`);
        return done(error);
      }
    }
  ));
}

// Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'displayName', 'photos'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          where: { provider: 'facebook', providerId: profile.id },
        });

        if (!user) {
          const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;

          // Check if email already exists with different provider
          const existingUser = await User.findOne({ where: { email } });

          if (existingUser) {
            // Link account - allow login with existing account
            logger.info(`[AUTH] Facebook login: Linking to existing account ${email} (was ${existingUser.provider})`);
            user = existingUser;
          } else {
            user = await User.create({
              email,
              name: profile.displayName,
              provider: 'facebook',
              providerId: profile.id,
              avatar: profile.photos?.[0]?.value || null,
              membershipType: 'A',
            });
            logger.info(`[AUTH] New user registered via Facebook: ${user.email}`);
          }
        } else {
          logger.info(`[AUTH] User logged in via Facebook: ${user.email}`);
        }

        return done(null, user);
      } catch (error) {
        logger.error(`[AUTH] Facebook auth error: ${error.message}`);
        return done(error);
      }
    }
  ));
}

module.exports = passport;
