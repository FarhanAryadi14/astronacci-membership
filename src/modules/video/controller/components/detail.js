const videoService = require('../../services/video.service');
const membershipService = require('../../../membership/services/membership.service');
const logger = require('../../../../shared/utils/logger');

const detail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { membershipType } = req.user;

    const video = await videoService.findBySlug(slug);

    if (!video) {
      req.flash('error', 'Video not found');
      return res.redirect('/videos');
    }

    // Check if user can access this video based on position
    const videos = await videoService.findAll();
    const videoIndex = videos.findIndex(v => v.id === video.id);
    const limit = membershipService.getLimit(membershipType, 'videos');

    if (videoIndex >= limit) {
      logger.warn(`[VIDEO] Access denied: User ${req.user.id} (${membershipType}) tried to access video at position ${videoIndex + 1}`);
      return res.render('videos/locked', {
        title: 'Access Denied',
        video: {
          title: video.title,
          thumbnail: video.thumbnail,
        },
        membershipType,
        requiredType: videoIndex < 10 ? 'B' : 'C',
      });
    }

    // Increment view count
    await videoService.incrementViewCount(video.id);

    res.render('videos/detail', {
      title: video.title,
      video,
    });
  } catch (error) {
    logger.error(`[VIDEO] Detail error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  detail,
};
