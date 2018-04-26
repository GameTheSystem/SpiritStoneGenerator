'use strict';

module.exports = {
  hub: {
    port: process.env.PORT,
  },
  db: {
    type: process.env.DB_TYPE,
    database: process.env.DB,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
};
