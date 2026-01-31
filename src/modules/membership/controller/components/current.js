const membershipService = require('../../services/membership.service');
const logger = require('../../../../shared/utils/logger');

const showMembershipPage = async (req, res, next) => {
  try {
    const currentMembership = membershipService.getMembershipInfo(req.user.membershipType);
    const allMemberships = membershipService.getAllMemberships();

    res.render('membership/index', {
      title: 'Membership',
      currentMembership,
      allMemberships,
    });
  } catch (error) {
    logger.error(`[MEMBERSHIP] Show page error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  showMembershipPage,
};
