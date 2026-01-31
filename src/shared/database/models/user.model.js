const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value) {
        this.setDataValue('email', value.toLowerCase());
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    provider: {
      type: DataTypes.ENUM('local', 'google', 'facebook'),
      defaultValue: 'local',
    },
    providerId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    membershipType: {
      type: DataTypes.ENUM('A', 'B', 'C'),
      defaultValue: 'A',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  });

  User.prototype.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return User;
};
