const logger = require('../utils/logger');

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  logger.warn(`[AUTH] Unauthorized access attempt to ${req.originalUrl}`);

  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      error: { code: 'UNAUTHORIZED' },
    });
  }

  req.flash('error', 'Please login to access this page');
  req.session.returnTo = req.originalUrl;
  return res.redirect('/auth/login');
};

const isGuest = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/dashboard');
};

const hasMembership = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/auth/login');
    }

    if (allowedTypes.includes(req.user.membershipType)) {
      return next();
    }

    logger.warn(`[AUTH] Membership access denied: User ${req.user.id} (${req.user.membershipType}) tried to access ${req.originalUrl}`);

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(403).json({
        success: false,
        message: 'Your membership does not allow access to this resource',
        error: { code: 'MEMBERSHIP_ACCESS_DENIED' },
      });
    }

    req.flash('error', 'Your membership does not allow access to this resource');
    return res.redirect('/membership');
  };
};

module.exports = {
  isAuthenticated,
  isGuest,
  hasMembership,
};
