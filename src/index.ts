import {
  _readContentFileAsync,
  _readContentFileSync,
  _readJsonFileAsync,
  _readJsonFileSync,
  _writeContentFileAsync,
  _writeContentFileSync,
  _writeJsonFileAsync,
  _writeJsonFileSync,
  _setJsonValue,
  _getJsonValue,
  _makeDirSync,
  _readJsonArraySync,
  _readJsonLinesSync,
} from "./managers/file";
import universalify = require("universalify");

const fileIt = {
  makeDirSync: _makeDirSync,
  readContentFileAsync: universalify.fromPromise(_readContentFileAsync),
  readContentFileSync: _readContentFileSync,
  readJsonFile: universalify.fromPromise(_readJsonFileAsync),
  readJsonFileSync: _readJsonFileSync,
  writeContentFile: universalify.fromPromise(_writeContentFileAsync),
  writeContentFileSync: _writeContentFileSync,
  writeJsonFile: universalify.fromPromise(_writeJsonFileAsync),
  writeJsonFileSync: _writeJsonFileSync,
  setJsonValue: _setJsonValue,
  getJsonValue: _getJsonValue,
  readJsonArraySync: _readJsonArraySync,
  readJsonLinesSync: _readJsonLinesSync,
};

module.exports = fileIt;
