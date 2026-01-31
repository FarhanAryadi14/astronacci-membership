const { User } = require('../../../shared/database/models');
const appConfig = require('../../../shared/config/app.config');
const logger = require('../../../shared/utils/logger');

const { limits, names, descriptions, prices } = appConfig.membership;

const getLimit = (membershipType, resourceType) => {
  const membershipLimits = limits[membershipType];
  if (!membershipLimits) {
    logger.warn(`[MEMBERSHIP] Unknown membership type: ${membershipType}`);
    return 0;
  }
  return membershipLimits[resourceType] || 0;
};

const getMembershipInfo = (membershipType) => {
  return {
    type: membershipType,
    name: names[membershipType] || 'Unknown',
    description: descriptions[membershipType] || '',
    limits: limits[membershipType] || { articles: 0, videos: 0 },
    price: prices[membershipType] || 0,
  };
};

const getAllMemberships = () => {
  return Object.keys(names).map(type => ({
    type,
    name: names[type],
    description: descriptions[type],
    limits: limits[type],
    price: prices[type],
  }));
};

const canAccess = (membershipType, resourceType, position) => {
  const limit = getLimit(membershipType, resourceType);
  return position <= limit;
};

const upgradeMembership = async (userId, newType) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const validTypes = Object.keys(names);
    if (!validTypes.includes(newType)) {
      return { success: false, message: 'Invalid membership type' };
    }

    const currentTypeIndex = validTypes.indexOf(user.membershipType);
    const newTypeIndex = validTypes.indexOf(newType);

    if (newTypeIndex <= currentTypeIndex) {
      return { success: false, message: 'Cannot downgrade membership' };
    }

    await user.update({ membershipType: newType });

    logger.info(`[MEMBERSHIP] User ${user.email} upgraded from ${user.membershipType} to ${newType}`);

    return {
      success: true,
      message: `Successfully upgraded to ${names[newType]} membership`,
      user: user.toJSON(),
    };
  } catch (error) {
    logger.error(`[MEMBERSHIP] Upgrade error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getLimit,
  getMembershipInfo,
  getAllMemberships,
  canAccess,
  upgradeMembership,
};
