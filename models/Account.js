'use strict';

const Sequelize = require('sequelize');

const Account = Sequelize.define('Account', {
  /**
   * Should fields that cover the following info:
   *
   * some internal id field used to reference this account
   * username,
   * password,
   * email address,
   * spirit stones
   */
});

module.exports = Account;
