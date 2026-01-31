const articleService = require('../../services/article.service');
const membershipService = require('../../../membership/services/membership.service');
const logger = require('../../../../shared/utils/logger');

const list = async (req, res, next) => {
  try {
    const { membershipType } = req.user;
    const limit = membershipService.getLimit(membershipType, 'articles');
    
    const articles = await articleService.findAll();
    const accessibleCount = Math.min(articles.length, limit);

    const articlesWithAccess = articles.map((article, index) => ({
      ...article.toJSON(),
      isAccessible: index < limit,
      position: index + 1,
    }));

    res.render('articles/list', {
      title: 'Articles',
      articles: articlesWithAccess,
      accessibleCount,
      totalCount: articles.length,
      limit,
      membershipType,
    });
  } catch (error) {
    logger.error(`[ARTICLE] List error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  list,
};
