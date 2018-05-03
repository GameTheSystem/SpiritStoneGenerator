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
    host: process.env.PRIVATEBIN_HOST || 'https://privatebin.net',
    password: process.env.PRIVATEBIN_PASS || '',
    expire: process.env.PRIVATEBIN_EXPIRE || 'never',
    formatter: 'plaintext',
    burnafterreading: 0,
    opendiscussion: 0,
  },
};
