const { body, validationResult } = require('express-validator');

const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      title: 'Login',
      errors: errors.array(),
      oldInput: { email: req.body.email },
    });
  }
  next();
};

module.exports = {
  loginValidationRules,
  validate,
};
