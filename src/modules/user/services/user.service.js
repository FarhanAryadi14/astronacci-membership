const { User } = require('../../../shared/database/models');
const bcrypt = require('bcryptjs');
const logger = require('../../../shared/utils/logger');

const findById = async (id) => {
  return User.findByPk(id);
};

const findByEmail = async (email) => {
  return User.findOne({ where: { email: email.toLowerCase() } });
};

const updateProfile = async (userId, data) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    await user.update({
      name: data.name,
    });

    logger.info(`[USER] Profile updated for user: ${user.email}`);

    return {
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON(),
    };
  } catch (error) {
    logger.error(`[USER] Update profile error: ${error.message}`);
    throw error;
  }
};

const updatePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.provider !== 'local') {
      return { success: false, message: 'Cannot change password for OAuth accounts' };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, message: 'Current password is incorrect' };
    }

    user.password = newPassword;
    await user.save();

    logger.info(`[USER] Password updated for user: ${user.email}`);

    return {
      success: true,
      message: 'Password updated successfully',
    };
  } catch (error) {
    logger.error(`[USER] Update password error: ${error.message}`);
    throw error;
  }
};

const updateMembership = async (userId, membershipType) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    await user.update({ membershipType });

    logger.info(`[USER] Membership updated for user: ${user.email} to ${membershipType}`);

    return {
      success: true,
      message: 'Membership updated successfully',
      user: user.toJSON(),
    };
  } catch (error) {
    logger.error(`[USER] Update membership error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  findById,
  findByEmail,
  updateProfile,
  updatePassword,
  updateMembership,
};
