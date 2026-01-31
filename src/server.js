require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./shared/database/models');
const logger = require('./shared/utils/logger');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('[DATABASE] Connection established successfully');

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    logger.info('[DATABASE] Models synchronized');

    app.listen(PORT, () => {
      logger.info(`[SERVER] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('[SERVER] Failed to start:', error);
    process.exit(1);
  }
};

startServer();
