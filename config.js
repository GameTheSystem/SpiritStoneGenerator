'use strict';

module.exports = {
  hub: {
    port: process.env.PORT,
  },
  db: {
    url: process.env.DB_URL,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
  // Default PrivateBin options
  privatebin: {
    host: 'https://privatebin.net',
    password: '',
    expire: 'never',
    formatter: 'plaintext',
    burnafterreading: 1,
    opendiscussion: 0,
  },
};
