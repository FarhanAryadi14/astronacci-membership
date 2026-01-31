const membershipService = require('../../services/membership.service');
const logger = require('../../../../shared/utils/logger');

const upgrade = async (req, res, next) => {
  try {
    const { type } = req.body;

    if (!type) {
      req.flash('error', 'Please select a membership type');
      return res.redirect('/membership');
    }

    const result = await membershipService.upgradeMembership(req.user.id, type);

    if (!result.success) {
      req.flash('error', result.message);
      return res.redirect('/membership');
    }

    logger.info(`[MEMBERSHIP] User ${req.user.email} upgraded to ${type}`);
    req.flash('success', result.message);
    return res.redirect('/membership');
  } catch (error) {
    logger.error(`[MEMBERSHIP] Upgrade error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  upgrade,
};
