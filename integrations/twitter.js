'use strict';

const execFile = require('child_process').execFile;

function createAccount() {
  return new Promise(function(resolve, reject) {

    execFile(`${__dirname}/scripts/runners/createAccount.sh`, (err, stdout, stderr) => {
      let result = JSON.parse(stdout);

      if (result.error) reject(result);
      else resolve(result);
    });

  });
}

module.exports = {
  createAccount,
};
