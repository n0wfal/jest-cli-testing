const exec = require('child_process').exec;
const path = require('path');
const normalCmd = path.join(__dirname, `..`, `bin`, `index.js`);
console.log(normalCmd);
const { dbPath: normalDbPath } = require(normalCmd);
console.log(normalDbPath)

const protectedCmd = path.join(__dirname, `..`, `bin`, `obfuscated.js`);
const { dbPath: protectedDbPath } = require(protectedCmd);
const execute = (cmd) => (args) => {
    return new Promise((resolve, reject) => {
        return exec(`node ${cmd} ${args.join(' ')}`, (error, stdOut, stdErr) => {
            if (error) {
                return reject(error)
            }
            return resolve({
                stdOut,
                stdErr
            });
        });
    });
}

module.exports = {
    executeUnprotected: execute(normalCmd),
    executeProtected: execute(protectedCmd),
    normalCmd,
    normalDbPath,
    protectedCmd,
    protectedDbPath
}