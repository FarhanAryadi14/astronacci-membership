const videoService = require('../../services/video.service');
const membershipService = require('../../../membership/services/membership.service');
const logger = require('../../../../shared/utils/logger');

const list = async (req, res, next) => {
  try {
    const { membershipType } = req.user;
    const limit = membershipService.getLimit(membershipType, 'videos');
    
    const videos = await videoService.findAll();
    const accessibleCount = Math.min(videos.length, limit);

    const videosWithAccess = videos.map((video, index) => ({
      ...video.toJSON(),
      isAccessible: index < limit,
      position: index + 1,
    }));

    res.render('videos/list', {
      title: 'Videos',
      videos: videosWithAccess,
      accessibleCount,
      totalCount: videos.length,
      limit,
      membershipType,
    });
  } catch (error) {
    logger.error(`[VIDEO] List error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  list,
};
