import fs = require("fs");
import path = require("path");
import { expect } from "chai";

const fileIt = require("../../src");
const rimraf = require("rimraf");

describe("File Integrity Tests", function () {
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

  it("Corrupt a file and recover with backup", function () {
    const file = path.join(TEST_DIR, 'tmp.json');
    const jsonData = { integrity: "test" };
    // save a valid json
    fileIt.writeJsonFileSync(file, jsonData);
    let val = fileIt.getJsonValue(file, "integrity");
    expect(val).to.equal("test");

    // corrupt it
    const result = fileIt.writeContentFileSync(file, "{integrity}:test");
    expect(result.error).to.not.be.null;

    // the json object should still be valid
    val = fileIt.getJsonValue(file, "integrity");
    expect(val).to.equal("test");
  });
});