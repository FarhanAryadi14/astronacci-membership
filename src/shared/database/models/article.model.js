const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Article = sequelize.define('Article', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    tableName: 'articles',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: (article) => {
        if (!article.slug) {
          article.slug = article.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
        if (article.isPublished && !article.publishedAt) {
          article.publishedAt = new Date();
        }
      },
    },
  });

  return Article;
};
