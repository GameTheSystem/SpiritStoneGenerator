'use strict';

const path = require('path');
const fs = require('fs');
const execFile = require('child_process').execFile;

const cwd = path.dirname(fs.realpathSync(__filename));

function createAccount() {
  return new Promise(function(resolve, reject) {

    execFile(`${cwd}/scripts/runners/createAccount.sh`, (err, stdout, stderr) => {
      let result;
      try {
        result = JSON.parse(stdout);
      } catch(e) {
        reject({error: e.toString()});
      }

      if (result === undefined || result.error) {
        reject(result);
      } else {
        fs.renameSync(`${cwd}/scripts/cookies/createAccount.txt`, `${cwd}/scripts/cookies/${result.email}${result.password}.txt`);
        resolve(result);
      }
    });

  });
}

module.exports = {
  createAccount,
};
