const { body, validationResult } = require('express-validator');

const profileValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
];

const passwordValidationRules = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),

  body('confirmNewPassword')
    .notEmpty()
    .withMessage('Please confirm your new password')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.validationErrors = errors.array();
  } else {
    req.validationErrors = [];
  }
  next();
};

module.exports = {
  profileValidationRules,
  passwordValidationRules,
  validate,
};
