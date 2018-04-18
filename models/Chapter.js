'use strict';

const Sequelize = require('sequelize');

const Chapter = Sequelize.define('Chapter', {
  /**
   * Should fields that cover the following info:
   *
   * Novel Title,
   * chapter,
   * accountId used to unlock this chapter most recently,
   * pastebin link,
   * pastebin expiration time if that's still a concern we have
   */
});

module.exports = Chapter;
