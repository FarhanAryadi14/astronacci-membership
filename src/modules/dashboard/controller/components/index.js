const articleService = require('../../../article/services/article.service');
const videoService = require('../../../video/services/video.service');
const membershipService = require('../../../membership/services/membership.service');
const logger = require('../../../../shared/utils/logger');

const showDashboard = async (req, res, next) => {
  try {
    const { membershipType } = req.user;
    const membershipInfo = membershipService.getMembershipInfo(membershipType);

    const [totalArticles, totalVideos] = await Promise.all([
      articleService.count(),
      videoService.count(),
    ]);

    const accessibleArticles = Math.min(totalArticles, membershipInfo.limits.articles);
    const accessibleVideos = Math.min(totalVideos, membershipInfo.limits.videos);

    res.render('dashboard/index', {
      title: 'Dashboard',
      membershipInfo,
      stats: {
        totalArticles,
        totalVideos,
        accessibleArticles,
        accessibleVideos,
      },
    });
  } catch (error) {
    logger.error(`[DASHBOARD] Error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  showDashboard,
};
