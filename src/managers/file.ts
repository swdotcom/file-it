import { cleanJsonString, jsonStringify } from "./util";
import fs = require("fs");

const universalify = require("universalify");

// this keeps a map of:
// fileName => jsonData
// in case reading ends of with a corrupted object
const dataMap: any = {};

export async function _makeDirSync(file: string) {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(file);
  }
}

/**
 * Read a file asynchronously
 * @param file
 * @param options
 */
export async function _readFileAsync(file: string): Promise<any> {
  let data: any = await universalify.fromCallback(fs.readFile)(file, {
    encoding: "utf8",
  });
  // remove byte order mark
  data = cleanJsonString(data);

  let obj: any;
  try {
    obj = JSON.parse(data);
  } catch (err) {
    err.message = `${file}: ${err.message}`;
    throw err;
  }

  return obj;
}

/**
 * Read a file synchronously
 * @param file
 * @param options
 */
export function _readFileSync(file: string) {
  try {
    let content: string = fs.readFileSync(file, { encoding: "utf8" });
    content = cleanJsonString(content);
    return JSON.parse(content);
  } catch (err) {
    err.message = `${file}: ${err.message}`;
    throw err;
  }
}

/**
 * Write a file asynchronously
 */
export async function _writeFileAsync(file: string, obj: any, options: any = {}) {
  dataMap[file] = obj;
  const str: string = jsonStringify(obj, options);
  if (!options.encoding) {
    options["encoding"] = "utf8";
  }
  await universalify.fromCallback(fs.writeFile)(file, str, options);
}

/**
 * Write a file synchronously
 */
export function _writeFileSync(file: string, obj: any, options: any = {}) {
  dataMap[file] = obj;
  const str: string = jsonStringify(obj, options);
  if (!options.encoding) {
    options["encoding"] = "utf8";
  }
  return fs.writeFileSync(file, str, options);
}

/**
 * Set/update a json element value
 */
export function _setJsonValue(file: string, key: string, value: any, options: any = {}) {
  // get the json and set/update
  const jsonObj: any = _readFileSync(file) || getCachedData(file);

  if (!jsonObj) {
    throw { message: `Error updating ${file}. Missing or content is malformed` };
  }

  jsonObj[key] = value;

  dataMap[file] = jsonObj;

  // write the update
  _writeFileSync(file, jsonObj, options);
}

/**
 * Get a json element value
 * @param file
 * @param key
 */
export function _getJsonValue(file: string, key: string): any {
  // get the value based on the key
  const jsonObj: any = _readFileSync(file) || getCachedData(file);

  if (!jsonObj) {
    throw { message: `Error updating ${file}. Missing or content is malformed` };
  }

  return jsonObj[key];
}

/**
 * Return a JSON array from a file containing lines of JSON
 * @param file
 */
export function _getJsonLinesSync(file: string): any[] {
  let jsonArray: any = [];
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, { encoding: "utf8" }).toString();
    if (content) {
      try {
        jsonArray = content
          .split(/\r?\n/)
          // parse each line to JSON
          .map((item) => {
            if (item) {
              return JSON.parse(item);
            }
            return null;
          })
          // make sure we don't return any null lines
          .filter((item) => item);
      } catch (err) {
        err.message = `${file}: ${err.message}`;
        throw err;
      }
    }
  }
  return jsonArray;
}

function getCachedData(file: string): any {
  return dataMap[file];
}