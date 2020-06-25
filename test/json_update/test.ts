const expect = require("chai").expect;
const fileIt = require("../../src");
const fs = require('fs');
const os = require('os');
const path = require('path');
const rimraf = require('rimraf');

describe("Json Update Tests", function () {
  let TEST_DIR: string = "";

  beforeEach((done) => {
    TEST_DIR = path.join(__dirname, "..", 'fileIt-tests');
    rimraf.sync(TEST_DIR);
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR);
    }
    done();
  });

  afterEach((done) => {
    rimraf.sync(TEST_DIR);
    done();
  });

  it("Validate updating a json file", function () {
    const file = path.join(TEST_DIR, 'tmp.json');
    fileIt.writeFileSync(file, { hello: "there" }, { spaces: 2 });
    fileIt.setJsonValue(file, "hello", "world", { spaces: 2 });
    const val = fileIt.getJsonValue(file, "hello");
    expect(val).to.equal("world");
  });

});