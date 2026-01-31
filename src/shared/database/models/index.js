const { Sequelize } = require('sequelize');
const config = require('../../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: dbConfig.define,
    pool: dbConfig.pool,
  }
);

const User = require('./user.model')(sequelize);
const Article = require('./article.model')(sequelize);
const Video = require('./video.model')(sequelize);

// Define associations
User.hasMany(Article, { foreignKey: 'authorId', as: 'articles' });
Article.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(Video, { foreignKey: 'authorId', as: 'videos' });
Video.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Article,
  Video,
};
