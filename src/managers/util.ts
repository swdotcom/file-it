/**
 * Stringify the object and replace newlines with EOL
 * @param obj 
 * @param options 
 */
export function jsonStringify(obj: any, options: any = {}) {
  const EOL = options.EOL || '\n';

  const str = JSON.stringify(obj, null, options.spaces);

  return str.replace(/\n/g, EOL) + EOL;
}

/**
 * Replace the Byte Order Mark
 * @param content 
 */
export function cleanJsonString(content: any) {
  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
  if (Buffer.isBuffer(content)) {
    content = content.toString('utf8');
  }
  return content.replace(/^\uFEFF/, '').replace(/\r\n/g, '').replace(/\n/g, '');
}