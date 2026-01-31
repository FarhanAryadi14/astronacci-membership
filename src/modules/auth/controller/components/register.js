const authService = require('../../services/auth.service');
const logger = require('../../../../shared/utils/logger');

const showRegisterPage = (req, res) => {
  res.render('auth/register', {
    title: 'Register',
    errors: [],
    oldInput: {},
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation errors from express-validator
    const errors = req.validationErrors || [];

    if (errors.length > 0) {
      return res.render('auth/register', {
        title: 'Register',
        errors,
        oldInput: { name, email },
      });
    }

    const result = await authService.register({ name, email, password });

    if (!result.success) {
      return res.render('auth/register', {
        title: 'Register',
        errors: [{ msg: result.message }],
        oldInput: { name, email },
      });
    }

    logger.info(`[AUTH] User registered successfully: ${email}`);
    req.flash('success', 'Registration successful! Please login.');
    return res.redirect('/auth/login');
  } catch (error) {
    logger.error(`[AUTH] Registration error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  showRegisterPage,
  register,
};
