'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.db.url, config.db);
const thisFile = path.basename(__filename);
const models = {};

fs.readdirSync(__dirname)
  .filter(fileName => fileName !== thisFile && fileName.indexOf('.') !== 0 && fileName.slice(-3) === '.js')
  .forEach((fileName) => {
    const model = sequelize.import(path.join(__dirname, fileName));
    models[model.name] = model;
  });

Object.keys(models).forEach((model) => {
  if (models[model].associate) {
    models[model].associate(models);
  }
});

module.exports = Object.assign(models, { sequelize });
