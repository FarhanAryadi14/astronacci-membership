const { Article, User } = require('../../../shared/database/models');
const logger = require('../../../shared/utils/logger');

const findAll = async (options = {}) => {
  const { limit, offset, includeUnpublished = false } = options;

  const where = {};
  if (!includeUnpublished) {
    where.isPublished = true;
  }

  return Article.findAll({
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
  return Article.findByPk(id, {
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
  return Article.findOne({
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
    await Article.increment('viewCount', { where: { id } });
  } catch (error) {
    logger.error(`[ARTICLE] Increment view count error: ${error.message}`);
  }
};

const count = async (includeUnpublished = false) => {
  const where = {};
  if (!includeUnpublished) {
    where.isPublished = true;
  }
  return Article.count({ where });
};

module.exports = {
  findAll,
  findById,
  findBySlug,
  incrementViewCount,
  count,
};
