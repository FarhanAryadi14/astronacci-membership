const { User } = require('../../../shared/database/models');
const logger = require('../../../shared/utils/logger');

const register = async ({ name, email, password }) => {
  try {
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });

    if (existingUser) {
      logger.warn(`[AUTH] Registration failed: Email already exists - ${email}`);
      return {
        success: false,
        message: 'Email already registered',
      };
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      provider: 'local',
      membershipType: 'A',
    });

    logger.info(`[AUTH] User created: ${user.email}`);

    return {
      success: true,
      message: 'Registration successful',
      user: user.toJSON(),
    };
  } catch (error) {
    logger.error(`[AUTH] Registration service error: ${error.message}`);
    throw error;
  }
};

const findByEmail = async (email) => {
  return User.findOne({ where: { email: email.toLowerCase() } });
};

const findById = async (id) => {
  return User.findByPk(id);
};

const findByProvider = async (provider, providerId) => {
  return User.findOne({ where: { provider, providerId } });
};

module.exports = {
  register,
  findByEmail,
  findById,
  findByProvider,
};
