import { EOL } from "os";


/**
 * Stringify the object and replace newlines with EOL
 * @param obj
 * @param options
 */
export function jsonStringify(obj: any, options: any = {}) {
  if (!obj) {
    return null;
  }

  const EOL = options.EOL || "\n";

  try {
    const str = JSON.stringify(obj, null, options.spaces);
    if (str !== null && str !== undefined) {
      return str.replace(/\n/g, EOL) + EOL;
    }

    return EOL;
  } catch (err) {
    console.log(`Error stringifying the object: ${err.message}`);
    return null;
  }
}

/**
 * Replace the Byte Order Mark
 * @param content
 */
export function cleanJsonString(content: any) {
  const EOL = "\n";
  if (!content) {
    return content;
  }
  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
  if (Buffer.isBuffer(content)) {
    content = content.toString("utf8");
  }
  if (content !== null && content !== undefined) {
    return content
      .replace(/^\uFEFF/, "")
      .replace(/\r\n/g, "")
      .replace(/\n/g, "");
  }
  return EOL;
}
