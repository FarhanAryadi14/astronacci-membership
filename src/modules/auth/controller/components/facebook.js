const passport = require('passport');
const logger = require('../../../../shared/utils/logger');

const facebookAuth = passport.authenticate('facebook', {
  scope: ['public_profile', 'email'],
});

const facebookCallback = (req, res, next) => {
  passport.authenticate('facebook', (err, user, info) => {
    if (err) {
      logger.error(`[AUTH] Facebook auth error: ${err.message}`);
      req.flash('error', 'Authentication failed. Please try again.');
      return res.redirect('/auth/login');
    }

    if (!user) {
      logger.warn(`[AUTH] Facebook auth failed: ${info?.message || 'Unknown error'}`);
      req.flash('error', info?.message || 'Authentication failed. Please try again.');
      return res.redirect('/auth/login');
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        logger.error(`[AUTH] Facebook session error: ${loginErr.message}`);
        req.flash('error', 'Login failed. Please try again.');
        return res.redirect('/auth/login');
      }

      logger.info(`[AUTH] User logged in via Facebook: ${user.email}`);
      req.flash('success', `Welcome, ${user.name}!`);
      return res.redirect('/dashboard');
    });
  })(req, res, next);
};

module.exports = {
  facebookAuth,
  facebookCallback,
};
