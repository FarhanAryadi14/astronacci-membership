const logger = require('../../../../shared/utils/logger');

const logout = (req, res, next) => {
  const userEmail = req.user?.email;

  req.logout((err) => {
    if (err) {
      logger.error(`[AUTH] Logout error: ${err.message}`);
      return next(err);
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        logger.error(`[AUTH] Session destroy error: ${sessionErr.message}`);
      }

      logger.info(`[AUTH] User logged out: ${userEmail}`);
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
};

module.exports = {
  logout,
};
