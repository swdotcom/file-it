import { cleanJsonString, jsonStringify } from "./util";
import fs = require("fs");
import universalify = require("universalify");

// this keeps a map of
// blah..................
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

/**
 * parse and return (throw an err if exception is caught
 * @param file
 */
export function _readContentFileSync(file: string): any {
  if (!fs.existsSync(file)) {
    return null;
  }

  try {
    let content: string = fs.readFileSync(file, { encoding: "utf8" });
    return content;
  } catch (err) {
    const content = tryCachedContent(file, false);
    if (!content) {
      const message = `Error reading file content. ${file} : ${err.message}`;
      return { error: err, message: message };
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
      const message = `Error reading JSON content. ${file} : ${err.message}`;
      return { error: err, message: message };
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
      const message = `Error parsing JSON content. ${file} : ${err.message}`;
      return { error: err, message: message };
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
        const message = `Error parsing cached JSON content. ${file} : ${err.message}`;
        return { error: err, message: message };
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
export async function _writeContentFileAsync(
  file: string,
  content: string,
  options: any = {},
) {
  if (!options.encoding) {
    options = {
      ...options,
      encoding: "utf8",
    };
  }
  const result = await universalify.fromCallback(fs.writeFile)(file, content, options);

  await updateContentMap(file, content, options);

  return result;
}

/**
 * Write a json file asynchronously
 */
export async function _writeJsonFileAsync(file: string, obj: any, options: any = {}) {
  const content: string = jsonStringify(obj, options);
  if (content) {
    _writeContentFileAsync(file, content, options);
  }
}

/**
 * Write a content file synchronously
 */
export async function _writeContentFileSync(
  file: string,
  content: string,
  options: any = {},
) {
  if (!options.encoding) {
    options = {
      ...options,
      encoding: "utf8",
    };
  }

  // check to see if the previous file is json
  if (contentMap[file] && isJsonFileType(file)) {
    try {
      const obj = JSON.parse(contentMap[file]);
      if (obj) {
        // the previous file is json, make sure we can parse this content to json
        JSON.parse(content);
      }
    } catch (err) {
      const message = `Error replacing existing JSON content with non-JSON content. ${file} : ${err.message}`;
      return { error: err, message: message };
    }
  }

  const result = fs.writeFileSync(file, content, options);

  await updateContentMap(file, content, options);

  return result;
}

/**
 * Write a json file synchronously
 */
export function _writeJsonFileSync(file: string, obj: any, options: any = {}) {
  const content: string = jsonStringify(obj, options);
  if (content) {
    return _writeContentFileSync(file, content, options);
  }
  return {error: "write content file sync error", message: ""};
}

export async function _appendJsonFileSync(file: string, obj: any, options: any = {}) {
  const content: string = jsonStringify(obj, options);
  if (!content) {
    return {error: "append file sync error", message: ""};
  }
  if (!options.encoding) {
    options = {
      ...options,
      encoding: "utf8",
    };
  }

  const result = fs.appendFileSync(file, content, options);

  // set the flag to append as this is the append request
  await updateContentMap(file, content, { flag: "a" });

  return result;
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

/**
 *
 * @param file
 * @param attribute
 * @param direction desc by default
 */
export function _findSortedJsonElement(
  file: string,
  attribute: string,
  direction: string = "asc",
) {
  const jsonArray = _readJsonArraySync(file);
  if (jsonArray && jsonArray.length) {
    if (direction.toLowerCase() === "desc") {
      // desc
      if (attribute) {
        jsonArray.sort((a: any, b: any) => a[attribute] - b[attribute]);
      } else {
        jsonArray.sort((a: any, b: any) => a - b);
      }
    } else {
      // asc
      if (attribute) {
        jsonArray.sort((a: any, b: any) => b[attribute] - a[attribute]);
      } else {
        jsonArray.sort((a: any, b: any) => b - a);
      }
    }
    return jsonArray[0];
  }
  return null;
}

async function updateContentMap(file: string, content: string, options: any) {
  if (options.flag && options.flag === "a") {
    await _readContentFileAsync(file).then((result) => {
      contentMap[file] = result;
    });
  } else {
    // overwrite what we have
    contentMap[file] = content;
  }
}

function getFileType(fileName: string) {
  let fileType: string = "";
  const lastDotIdx: number = fileName.lastIndexOf(".");
  const len: number = fileName.length;
  if (lastDotIdx !== -1 && lastDotIdx < len - 1) {
    fileType = fileName.substring(lastDotIdx + 1);
  }
  return fileType || "";
}

function isJsonFileType(fileName: string) {
  const fileType: string = getFileType(fileName);
  if (fileType.toLowerCase() === "json") {
    return true;
  }
  return false;
}
