const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        email: 'admin@astronacci.com',
        password: hashedPassword,
        name: 'Admin User',
        provider: 'local',
        membership_type: 'C',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        email: 'user.a@example.com',
        password: hashedPassword,
        name: 'User Basic',
        provider: 'local',
        membership_type: 'A',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        email: 'user.b@example.com',
        password: hashedPassword,
        name: 'User Premium',
        provider: 'local',
        membership_type: 'B',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        email: 'user.c@example.com',
        password: hashedPassword,
        name: 'User Unlimited',
        provider: 'local',
        membership_type: 'C',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
