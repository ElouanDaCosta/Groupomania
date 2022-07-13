module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
      name: {
          type: DataTypes.STRING,
          allowNull: false,
          UNIQUE: true,
      },
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          UNIQUE: true,
      },
      password: {
          type: DataTypes.STRING,
          allowNull: false,
      },
  })
  module.exports = User;
  return User
};