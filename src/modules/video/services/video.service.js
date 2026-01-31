const { Video, User } = require('../../../shared/database/models');
const logger = require('../../../shared/utils/logger');

const findAll = async (options = {}) => {
  const { limit, offset, includeUnpublished = false } = options;

  const where = {};
  if (!includeUnpublished) {
    where.isPublished = true;
  }

  return Video.findAll({
    where,
    order: [['publishedAt', 'DESC']],
    limit,
    offset,
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'avatar'],
      },
    ],
  });
};

const findById = async (id) => {
  return Video.findByPk(id, {
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'avatar'],
      },
    ],
  });
};

const findBySlug = async (slug) => {
  return Video.findOne({
    where: { slug, isPublished: true },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'avatar'],
      },
    ],
  });
};

const incrementViewCount = async (id) => {
  try {
    await Video.increment('viewCount', { where: { id } });
  } catch (error) {
    logger.error(`[VIDEO] Increment view count error: ${error.message}`);
  }
};

const count = async (includeUnpublished = false) => {
  const where = {};
  if (!includeUnpublished) {
    where.isPublished = true;
  }
  return Video.count({ where });
};

const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

module.exports = {
  findAll,
  findById,
  findBySlug,
  incrementViewCount,
  count,
  formatDuration,
};
