'use strict';

module.exports = {
  hub: {
    port: process.env.PORT,
  },
  db: {
    database: process.env.DB,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
};
