# Easily read/write/update JSON files

file-it
================

Helps minimize the amount of `fs` read and write logic, `try/catch` logic, writes clean UTF8 json content, and cleans up byte order mark and newline characters to cleanly read and parse json content.



Installation
------------

    npm install --save file-it
    OR
    yarn add file-it

Import or Require
-----------------
    import fileIt from "file-it";
    OR
    const fileIt = require("file-it");

API
---

* [`setJsonValue(filename, key, value, [options])`](#setjsonvalue-filename-key-value-options)
* [`getJsonValue(filename, key)`](#getjsonvaluefilename-key)
* [`getJsonLinesSync(filename)`](#getjsonlinessyncfilename)
* [`readJsonFile(filename, callback)`](#readjsonfilefilename-options-callback)
* [`readJsonFileSync(filename)`](#readjsonfilesyncfilename)
* [`writeJsonFile(filename, obj, [options], callback)`](#writejsonfilefilename-obj-options-callback)
* [`writeJsonFileSync(filename, obj, [options])`](#writejsonfilesyncfilename-obj-options)

----

### setJsonValue(filename, key, value, [options])

`filename` the full file path
`key` the name of the element in the json file
`value` the value you want to set

```js
const fileIt = require('file-it')
const file = '/tmp/data.json'
fileIt.setJsonValue(file, "hello", "universe", {spaces: 2});
```

### getJsonValue(filename, key)

`filename` the full file path
`key` the name of the element in the json file

```js
const fileIt = require('file-it')
const file = '/tmp/data.json'
await fileIt.setJsonValue(file, "hello", "universe", {spaces: 2});
const val = await fileIt.getJsonValue(file, "hello");
console.log("val: ", val); // prints out "universe"
```

### getJsonLinesSync(filename)

`filename` the full file path
  - `throws` If `JSON.parse` throws an error, pass this error to the callback


```js
const fileIt = require('file-it')
const file = '/tmp/linesOfJsonData.json'
fileIt.getJsonLinesSync(file, function (err, obj) {
  if (err) console.error(err)
  console.dir(obj)
})
```

### readJsonFile(filename)

`filename` the full file path
  - `throws` If `JSON.parse` throws an error, pass this error to the callback


```js
const fileIt = require('file-it')
const file = '/tmp/data.json'
fileIt.readJsonFile(file, function (err, obj) {
  if (err) console.error(err)
  console.dir(obj)
})
```

You can also use this method with promises. The `readJsonFile` method will return a promise if you do not pass a callback function.

```js
const fileIt = require('file-it')
const file = '/tmp/data.json'
fileIt.readJsonFile(file)
  .then(obj => console.dir(obj))
  .catch(error => console.error(error))
```

----

### readJsonFileSync(filename, [options])

- `throws` If an error is encountered reading or parsing the file, throw the error

```js
const fileIt = require('file-it')
const file = '/tmp/data.json'

console.dir(fileIt.readJsonFileSync(file))
```

----

### writeJsonFile(filename, obj, [options], callback)

`options`: Pass in any [`fs.writeFile`](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback) options or set `replacer` for a [JSON replacer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify). Can also pass in `spaces` and override `EOL` string.


```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFile(file, obj, function (err) {
  if (err) console.error(err)
})
```
Or use with promises as follows:

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFile(file, obj)
  .then(res => {
    console.log('Write complete')
  })
  .catch(error => console.error(error))
```


**formatting with spaces:**

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFile(file, obj, { spaces: 2 }, function (err) {
  if (err) console.error(err)
})
```

**overriding EOL:**

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFile(file, obj, { spaces: 2, EOL: '\r\n' }, function (err) {
  if (err) console.error(err)
})
```

**appending to an existing JSON file:**

You can use `fs.writeFile` option `{ flag: 'a' }` to achieve this.

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFile(file, obj, { flag: 'a' }, function (err) {
  if (err) console.error(err)
})
```

----

### writeJsonFileSync(filename, obj, [options])

`options`: Pass in any [`fs.writeFileSync`](https://nodejs.org/api/fs.html#fs_fs_writefilesync_file_data_options) options or set `replacer` for a [JSON replacer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify). Can also pass in `spaces` and override `EOL` string.

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFileSync(file, obj)
```

**formatting with spaces:**

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFileSync(file, obj, { spaces: 2 })
```

**overriding EOL:**

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFileSync(file, obj, { spaces: 2, EOL: '\r\n' })
```

**appending to an existing JSON file:**

You can use `fs.writeFileSync` option `{ flag: 'a' }` to achieve this.

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFileSync(file, obj, { flag: 'a' })
```


