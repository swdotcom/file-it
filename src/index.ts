import {
  _readJsonFileAsync,
  _readJsonFileSync,
  _writeJsonFileAsync,
  _writeJsonFileSync,
  _setJsonValue,
  _getJsonValue,
  _makeDirSync,
  _getJsonLinesSync,
} from "./managers/file";
import universalify = require("universalify");

const fileIt = {
  makeDirSync: _makeDirSync,
  readJsonFile: universalify.fromPromise(_readJsonFileAsync),
  readJsonFileSync: _readJsonFileSync,
  writeJsonFile: universalify.fromPromise(_writeJsonFileAsync),
  writeJsonFileSync: _writeJsonFileSync,
  setJsonValue: _setJsonValue,
  getJsonValue: _getJsonValue,
  getJsonLinesSync: _getJsonLinesSync,
};

module.exports = fileIt;
