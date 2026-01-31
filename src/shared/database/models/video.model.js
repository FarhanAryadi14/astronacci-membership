const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Video = sequelize.define('Video', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Duration in seconds',
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
    tableName: 'videos',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: (video) => {
        if (!video.slug) {
          video.slug = video.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
        if (video.isPublished && !video.publishedAt) {
          video.publishedAt = new Date();
        }
      },
    },
  });

  return Video;
};
