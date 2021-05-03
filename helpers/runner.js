const { exec, spawn } = require("child_process");
const path = require("path");
const normalCmd = path.join(__dirname, `..`, `bin`, `index.js`);
const { dbPath: normalDbPath } = require(normalCmd);

const protectedCmd = path.join(__dirname, `..`, `bin`, `obfuscated.js`);
const { dbPath: protectedDbPath } = require(protectedCmd);
const execute = (cmd) => (args) => {
  return new Promise((resolve, reject) => {
    return exec(`node ${cmd} ${args.join(" ")}`, (error, stdOut, stdErr) => {
      if (error) {
        return reject(error);
      }
      return resolve({ stdOut, stdErr });
    });
  });
};

const spawnProcess = (cmd) => (args) => spawn(`node`, [cmd, ...args]);

module.exports = {
  executeUnprotected: execute(normalCmd),
  executeProtected: execute(protectedCmd),
  spawnNormal: spawnProcess(normalCmd),
  spawnObfuscated: spawnProcess(protectedCmd),
  normalCmd,
  normalDbPath,
  protectedCmd,
  protectedDbPath,
};
