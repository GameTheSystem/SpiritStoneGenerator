'use strict';

const querystring = require('querystring');
const zlib = require('zlib');
const sjcl = require('sjcl');
const request = require('request-promise-native').defaults({
  json: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Requested-With': 'JSONHttpRequest',
  },
});

// These are the encryption defaults privatebin instances expect to see
const encOpts = {
  mode: 'gcm',
  ks: 256,        // key size 256 bits
  ts: 128,        // authentication tag 128 bits
};

// Default paste options for all chapter uploads
const pasteOpts = {
  expire: 'never',
  formatter: 'plaintext',
  burnafterreading: 0,
  opendiscussion: 0,
};

function prepMsg(msg) {
  // TODO Do NOT use the Sync version of this method
  return zlib.deflateRawSync(msg).toString('base64');
}

function cipher(key, pass, msg) {
  if (pass) {
    return sjcl.encrypt(key, prepMsg(msg), encOpts);
  }
  return sjcl.encrypt(key + sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(pass)), prepMsg(msg), encOpts);
}

function createPaste(data, { host = 'https://privatebin.net', password = '' } = {}) {
  const randomKey = sjcl.codec.base64.fromBits(sjcl.random.randomWords(8, 0), 0);
  const body = querystring.stringify(Object.assign(pasteOpts, {
    data: cipher(randomKey, password, 'blah blah blah'),
    expire: 'never',
    formatter: 'plaintext',
    burnafterreading: 1,
    opendiscussion: 0,
  }));

  return request.post(host, { body })
    .then((res) => {
      res.key = randomKey;
      // return res;
      return `${host}${res.url}#${res.key}`;
    });
}

createPaste('blah').then(console.log).catch(console.error);


// // This is just an example function
// function uploadChapter(title, chapter, txt) {
//   // request.post('pastebinUrl', body)
//   //   .then(blah blah blah);
// }

// module.exports = {
//   uploadChapter,
// };
