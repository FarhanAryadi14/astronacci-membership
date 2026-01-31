const userService = require('../../services/user.service');
const logger = require('../../../../shared/utils/logger');

const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const errors = req.validationErrors || [];

    if (errors.length > 0) {
      return res.render('user/profile', {
        title: 'My Profile',
        profile: req.user,
        errors,
      });
    }

    const result = await userService.updateProfile(req.user.id, { name });

    if (!result.success) {
      req.flash('error', result.message);
      return res.redirect('/user/profile');
    }

    logger.info(`[USER] Profile updated: ${req.user.email}`);
    req.flash('success', 'Profile updated successfully');
    return res.redirect('/user/profile');
  } catch (error) {
    logger.error(`[USER] Profile update error: ${error.message}`);
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const errors = req.validationErrors || [];

    if (errors.length > 0) {
      return res.render('user/profile', {
        title: 'My Profile',
        profile: req.user,
        errors,
      });
    }

    const result = await userService.updatePassword(req.user.id, currentPassword, newPassword);

    if (!result.success) {
      req.flash('error', result.message);
      return res.redirect('/user/profile');
    }

    logger.info(`[USER] Password updated: ${req.user.email}`);
    req.flash('success', 'Password updated successfully');
    return res.redirect('/user/profile');
  } catch (error) {
    logger.error(`[USER] Password update error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  updateProfile,
  updatePassword,
};
