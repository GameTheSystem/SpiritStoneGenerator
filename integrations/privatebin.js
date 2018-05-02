'use strict';

/**
 * PrivateBin Encryption Docs: https://github.com/PrivateBin/PrivateBin/wiki/Encryption-format
 * PrivateBin API Docs: https://github.com/PrivateBin/PrivateBin/wiki/API
 */

const querystring = require('querystring');
const zlib = require('zlib');
const crypto = require('crypto');
const config = require('../config');
const request = require('request-promise-native').defaults({
  json: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Requested-With': 'JSONHttpRequest',
  },
});

// These are the encryption defaults privatebin instances expect to see in SJCL format
const encOpts = {
  v: 1,           // version number of the SJCL format being used
  cipher: 'aes',
  mode: 'gcm',
  adata: '',      // optional cleartext auth data, not currently used
  iter: 10000,    // Key Iterations
  ks: 256,        // key size in bits
};
Object.freeze(encOpts);

/**
 * Generates the PrivateBin url given a specific PrivateBin host, pasteId, and key.
 * @param {String} host The PrivateBin host url
 * @param {String} pasteId The id of a generated paste
 * @param {String} key The key used to generate the paste belonging to the pasteId
 */
function genUrl(host, pasteId, key) {
  return `${host}/?${pasteId}#${key}`;
}

/**
 * Compresses a message and then encodes it as base64 afterwards, which is the format PrivateBin expects it to be in.
 * @param {String} msg The payload being sent to privatebin in plain text.
 */
function prepMsg(msg) {
  return new Promise((resolve, reject) => {
    zlib.deflateRaw(Buffer.from(msg, 'utf16le').toString('utf8'), (err, data) => {
      if (err) return reject(err);
      return resolve(data.toString('base64'));
    });
  });
}

/**
 * This is a promise wrapper around the asynchronous crypto.pbkdf2 function.
 * Look here for more documentation:
 * https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2_password_salt_iterations_keylen_digest_callback
 * @param {String} passphrase Used to derive the secure key
 * @param {Buffer} salt Mix it up a little security wise ;)
 * @param {Number} iterations The iterations this algorithm runs for
 * @param {Number} keySize The key size in bytes
 * @param {String} digest An HMAC digest algorithm (e.g. sha256)
 */
function genKey(passphrase, salt, iterations, keySize, digest) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(passphrase, salt, iterations, keySize, digest, (err, derivedKey) => {
      if (err) return reject(err);
      return resolve(derivedKey);
    });
  });
}

/**
 * Encrypts any message according to the provided key and password in the format PrivateBin expects.
 * @param {String} msg The payload being sent to privatebin in plain text.
 * @param {String} masterKey A randomly generated base64 key. Used by PasteBin clients to decrypt pastes.
 * @param {String} pass An optional password. Used by PasteBin clients in conjunction with the masterKey for decryption.
 */
async function encrypt(msg, masterKey, pass) {
  // Pre-Encryption Values
  const iv = crypto.randomBytes(16);
  const salt = crypto.randomBytes(8);
  const passphrase = `${masterKey}${pass ? crypto.createHash('sha256').update(pass).digest('hex') : ''}`;

  // Actual Encryption
  const [preppedMsg, key] = await Promise.all([prepMsg(msg),
    genKey(passphrase, salt, encOpts.iter, encOpts.ks / 8, 'sha256')]);
  const cipher = crypto.createCipheriv(`${encOpts.cipher}-${encOpts.ks}-${encOpts.mode}`, key, iv);
  const encrypted = Buffer.concat([cipher.update(preppedMsg), cipher.final()]);

  return Object.assign({
    iv: iv.toString('base64'),
    ts: cipher.getAuthTag().length * 8,     // authentication tag size in bits
    salt: salt.toString('base64'),
    ct: Buffer.concat([encrypted, cipher.getAuthTag()]).toString('base64'),
  }, encOpts);
}

/**
 * Creates a paste on a PrivateBin instance.
 * @param {String} data The data to paste to PrivateBin
 * @param {Object} options Any options relevant to creating a PrivateBin Paste. Check the API docs at the top of the
 * file to see more info.
 */
function createPaste(data, options = {}) {
  const randomKey = crypto.randomBytes(32).toString('base64');
  options = Object.assign({}, config.privatebin, options);      // eslint-disable-line no-param-reassign

  return encrypt(data, randomKey, options.password)
    .then((payload) => {
      const body = querystring.stringify({
        data: JSON.stringify(payload),
        expire: options.expire,
        formatter: options.formatter,
        burnafterreading: options.burnafterreading,
        opendiscussion: options.opendiscussion,
      });

      return request.post(options.host, { body })
        .then((res) => {
          res.key = randomKey;
          res.url = genUrl(options.host, res.id, randomKey);
          return res;
        });
    });
}

/**
 * Will upload a chapter to a privatebin instance. Will use https://privatebin.net by default.
 * @param {String} novel The name of the novel this chapter is for.
 * @param {String} title The title of this chapter.
 * @param {String} chapter The actual chapter to create a paste for.
 */
function uploadChapter(novel, title, chapter) {
  const data = `${novel} - ${title}:\n\n${chapter}`;
  return createPaste(data);
}

module.exports = {
  createPaste,
  uploadChapter,
};
