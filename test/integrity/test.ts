import fs = require("fs");
import path = require("path");
import { expect } from "chai";

const fileIt = require("../../src");
const rimraf = require("rimraf");

// lkjlkjlkjlk.0
describe("File Integrity Tests", function () {
  let TEST_DIR: string = "";

  beforeEach((done) => {
    TEST_DIR = path.join(__dirname, "..", "fileIt-tests");
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

  it("Test json corrupt using apis", function () {
    const file = path.join(TEST_DIR, "tmp.json");
    const jsonData = { integrity: "test" };
    // save a valid json
    fileIt.writeJsonFileSync(file, jsonData);
    let val = fileIt.getJsonValue(file, "integrity");
    expect(val).to.equal("test");

    // attemp to corrupt file using api
    const result = fileIt.writeContentFileSync(file, "{integrity}:test");
    expect(result.error).to.not.be.null;

    // the json object should still be valid
    val = fileIt.getJsonValue(file, "integrity");
    expect(val).to.equal("test");
  });

  it("Test json corrupt using native functions", function () {
    const file = path.join(TEST_DIR, "tmp.json");
    const jsonData = { integrity: "test" };
    // save a valid json
    fileIt.writeJsonFileSync(file, jsonData);
    let val = fileIt.getJsonValue(file, "integrity");
    expect(val).to.equal("test");

    // corrupt it
    fs.writeFileSync(file, "{integrety}:test", {
      encoding: "utf8",
    });
    const corruptedFile = fs.readFileSync(file, {
      encoding: "utf8",
    });
    expect(corruptedFile.includes(":test")).to.be.true;

    // the json object should still be valid based on the cached content
    val = fileIt.getJsonValue(file, "integrity");
    expect(val).to.equal("test");
  });

  it("Empty file and get empty file", function () {
    const file = path.join(TEST_DIR, "tmp.json");
    const jsonData = { integrity: "test" };
    // save a valid json
    fileIt.writeJsonFileSync(file, jsonData);

    // corrupt it
    fs.writeFileSync(file, JSON.stringify({}), {
      encoding: "utf8",
    });

    const data = fileIt.readJsonFileSync(file);
    expect(Object.keys(data).length).to.equal(0);
  });
});
