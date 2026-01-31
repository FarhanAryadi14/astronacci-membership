const passport = require('passport');
const logger = require('../../../../shared/utils/logger');

const showLoginPage = (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    errors: [],
    oldInput: {},
  });
};

const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      logger.error(`[AUTH] Login error: ${err.message}`);
      return next(err);
    }

    if (!user) {
      logger.warn(`[AUTH] Login failed: ${info?.message || 'Invalid credentials'}`);
      return res.render('auth/login', {
        title: 'Login',
        errors: [{ msg: info?.message || 'Invalid email or password' }],
        oldInput: { email: req.body.email },
      });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        logger.error(`[AUTH] Session login error: ${loginErr.message}`);
        return next(loginErr);
      }

      logger.info(`[AUTH] User logged in: ${user.email}`);
      
      const returnTo = req.session.returnTo || '/dashboard';
      delete req.session.returnTo;
      
      req.flash('success', `Welcome back, ${user.name}!`);
      return res.redirect(returnTo);
    });
  })(req, res, next);
};

module.exports = {
  showLoginPage,
  login,
};
