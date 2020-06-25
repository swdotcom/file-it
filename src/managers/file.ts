import { cleanJsonString, jsonStringify } from "./util";
import fs = require("fs");
import universalify = require("universalify");

// this keeps a map of:
// fileName => jsonData
// in case reading ends of with a corrupted object
const contentMap: any = {};

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
export async function _readContentFileAsync(file: string): Promise<any> {
  if (!fs.existsSync(file)) {
    return null;
  }

  let content: any = await universalify.fromCallback(fs.readFile)(file, {
    encoding: "utf8",
  });

  return content;
}

/**
 * Read a file asynchronously
 * @param file
 * @param options
 */
export async function _readJsonFileAsync(file: string): Promise<any> {
  if (!fs.existsSync(file)) {
    return null;
  }

  let content: any = await universalify.fromCallback(fs.readFile)(file, {
    encoding: "utf8",
  });

  return parseJsonContent(file, content);
}

export function _readContentFileSync(file: string): any {
  if (!fs.existsSync(file)) {
    return null;
  }

  try {
    let content: string = fs.readFileSync(file, { encoding: "utf8" });
    return content
  } catch (err) {
    const content = tryCachedContent(file, false);
    if (!content) {
      err.message = `${file}: ${err.message}`;
      throw err;
    }
    return content;
  }
}

/**
 * Read a file synchronously
 * @param file
 * @param options
 */
export function _readJsonFileSync(file: string): any {
  if (!fs.existsSync(file)) {
    return null;
  }

  try {
    let content: string = fs.readFileSync(file, { encoding: "utf8" });
    return parseJsonContent(file, content);
  } catch (err) {
    const obj = tryCachedContent(file);
    if (!obj) {
      err.message = `${file}: ${err.message}`;
      throw err;
    }
    return obj;
  }
}

function parseJsonContent(file: string, content: any) {
  // remove byte order mark
  content = cleanJsonString(content);

  let obj: any;
  try {
    obj = JSON.parse(content);
  } catch (err) {
    obj = tryCachedContent(file);
    if (!obj) {
      err.message = `${file}: ${err.message}`;
      throw err;
    }
  }
  return obj;
}

function tryCachedContent(file: string, isJson: boolean = true) {
  let obj: any;
  let content: string = contentMap[file];
  if (content) {
    content = cleanJsonString(content);
    if (isJson) {
      try {
        obj = JSON.parse(content);
      } catch (err) {
        err.message = `${file}: ${err.message}`;
        throw err;
      }
    } else {
      obj = content;
    }
  }
  // save the cached content
  _writeContentFileSync(file, content);

  return obj;
}

/**
 * Write a content file asynchronously
 */
export async function _writeContentFileAsync(file: string, content: string, options: any = {}) {
  contentMap[file] = content;
  if (!options.encoding) {
    options = {
      ...options,
      encoding: "utf8"
    }
  }
  await universalify.fromCallback(fs.writeFile)(file, content, options);
}

/**
 * Write a json file asynchronously
 */
export async function _writeJsonFileAsync(file: string, obj: any, options: any = {}) {
  const content: string = jsonStringify(obj, options);
  _writeContentFileAsync(file, content, options);
}

/**
 * Write a content file synchronously
 */
export function _writeContentFileSync(file: string, content: string, options: any = {}) {
  contentMap[file] = content;
  if (!options.encoding) {
    options = {
      ...options,
      encoding: "utf8"
    }
  }
  return fs.writeFileSync(file, content, options);
}

/**
 * Write a json file synchronously
 */
export function _writeJsonFileSync(file: string, obj: any, options: any = {}) {
  const content: string = jsonStringify(obj, options);
  contentMap[file] = content;
  return _writeContentFileSync(file, content, options);
}

/**
 * Set/update a json element value
 */
export function _setJsonValue(file: string, key: string, value: any, options: any = {}) {
  // get the json and set/update
  let jsonObj: any = _readJsonFileSync(file);


  if (!jsonObj) {
    jsonObj = {};
  }

  jsonObj[key] = value;

  // write the update
  _writeJsonFileSync(file, jsonObj, options);
}

/**
 * Get a json element value
 * @param file
 * @param key
 */
export function _getJsonValue(file: string, key: string): any {
  // get the value based on the key
  const jsonObj: any = _readJsonFileSync(file);

  if (!jsonObj) {
    return null;
  }

  return jsonObj[key];
}

export function _readJsonArraySync(file: string): any[] {
  // get the value based on the key
  const jsonObj: any = _readJsonFileSync(file);
  if (jsonObj) {
    if (Array.isArray(jsonObj)) {
      return jsonObj;
    } else {
      return [jsonObj];
    }
  }
  return [];
}

/**
 * Return a JSON array from a file containing lines of JSON
 * @param file
 */
export function _readJsonLinesSync(file: string): any[] {
  let jsonArray: any = [];
  if (fs.existsSync(file)) {
    const content = _readContentFileSync(file);
    if (content) {
      try {
        jsonArray = content
          .split(/\r?\n/)
          // parse each line to JSON
          .map((item: string) => {
            if (item) {
              return JSON.parse(item);
            }
            return null;
          })
          // make sure we don't return any null lines
          .filter((item: string) => item);
      } catch (err) {
        err.message = `${file}: ${err.message}`;
        throw err;
      }
    }
  }
  return jsonArray;
}
