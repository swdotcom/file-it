import {
  _readFileAsync,
  _readFileSync,
  _writeFileAsync,
  _writeFileSync,
  _setJsonValue,
  _getJsonValue,
  _makeDirSync,
} from "./managers/file";
const universalify = require("universalify");

const fileIt = {
  makeDirSync: _makeDirSync,
  readFile: universalify.fromPromise(_readFileAsync),
  readFileSync: _readFileSync,
  writeFile: universalify.fromPromise(_writeFileAsync),
  writeFileSync: _writeFileSync,
  setJsonValue: _setJsonValue,
  getJsonValue: _getJsonValue,
};

module.exports = fileIt;
