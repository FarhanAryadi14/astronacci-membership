const logger = require('../utils/logger');

const notFoundHandler = (req, res, next) => {
  logger.warn(`[404] Route not found: ${req.method} ${req.originalUrl}`);

  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(404).json({
      success: false,
      message: 'Resource not found',
      error: { code: 'NOT_FOUND' },
    });
  }

  res.status(404).render('errors/404', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
  });
};

const errorHandler = (err, req, res, next) => {
  logger.error(`[ERROR] ${err.message}`, { stack: err.stack });

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal server error'
    : err.message;

  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: {
        code: err.code || 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
      },
    });
  }

  res.status(statusCode).render('errors/error', {
    title: 'Error',
    message,
    statusCode,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : null,
  });
};

class AppError extends Error {
  constructor(message, statusCode = 400, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  notFoundHandler,
  errorHandler,
  AppError,
};
