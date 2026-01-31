const articleService = require('../../services/article.service');
const membershipService = require('../../../membership/services/membership.service');
const logger = require('../../../../shared/utils/logger');

const detail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { membershipType } = req.user;

    const article = await articleService.findBySlug(slug);

    if (!article) {
      req.flash('error', 'Article not found');
      return res.redirect('/articles');
    }

    // Check if user can access this article based on position
    const articles = await articleService.findAll();
    const articleIndex = articles.findIndex(a => a.id === article.id);
    const limit = membershipService.getLimit(membershipType, 'articles');

    if (articleIndex >= limit) {
      logger.warn(`[ARTICLE] Access denied: User ${req.user.id} (${membershipType}) tried to access article at position ${articleIndex + 1}`);
      return res.render('articles/locked', {
        title: 'Access Denied',
        article: {
          title: article.title,
          thumbnail: article.thumbnail,
        },
        membershipType,
        requiredType: articleIndex < 10 ? 'B' : 'C',
      });
    }

    // Increment view count
    await articleService.incrementViewCount(article.id);

    res.render('articles/detail', {
      title: article.title,
      article,
    });
  } catch (error) {
    logger.error(`[ARTICLE] Detail error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  detail,
};
