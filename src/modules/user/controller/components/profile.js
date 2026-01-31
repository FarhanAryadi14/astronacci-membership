const userService = require('../../services/user.service');
const logger = require('../../../../shared/utils/logger');

const showProfile = async (req, res, next) => {
  try {
    const user = await userService.findById(req.user.id);

    res.render('user/profile', {
      title: 'My Profile',
      profile: user,
    });
  } catch (error) {
    logger.error(`[USER] Profile view error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  showProfile,
};
