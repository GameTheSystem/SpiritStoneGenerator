'use strict';

module.exports = (sequelize, DataTypes) => {
  const Chapter = sequelize.define('Chapter', {
    novel: DataTypes.STRING,
    chapter: DataTypes.INTEGER,
    url: DataTypes.STRING,
  });

  Chapter.associate = (models) => {
    models.Chapter.belongsTo(models.Account);
  };

  return Chapter;
};
