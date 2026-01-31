const passport = require('passport');
const logger = require('../../../../shared/utils/logger');

const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

const googleCallback = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      logger.error(`[AUTH] Google auth error: ${err.message}`);
      req.flash('error', 'Authentication failed. Please try again.');
      return res.redirect('/auth/login');
    }

    if (!user) {
      logger.warn(`[AUTH] Google auth failed: ${info?.message || 'Unknown error'}`);
      req.flash('error', info?.message || 'Authentication failed. Please try again.');
      return res.redirect('/auth/login');
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        logger.error(`[AUTH] Google session error: ${loginErr.message}`);
        req.flash('error', 'Login failed. Please try again.');
        return res.redirect('/auth/login');
      }

      logger.info(`[AUTH] User logged in via Google: ${user.email}`);
      req.flash('success', `Welcome, ${user.name}!`);
      return res.redirect('/dashboard');
    });
  })(req, res, next);
};

module.exports = {
  googleAuth,
  googleCallback,
};
