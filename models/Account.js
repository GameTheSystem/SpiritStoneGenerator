'use strict';

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    spiritStones: DataTypes.INTEGER,
    banned: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  Account.associate = (models) => {
    models.Account.hasMany(models.Chapter);
  };

  return Account;
};
