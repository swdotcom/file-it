import chai = require("chai");
import fs = require("fs");
import path = require("path");
import { expect } from "chai";

const fileIt = require("../../src");
const rimraf = require("rimraf");

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
    fileIt.writeJsonFileSync(file, { hello: "there" }, { spaces: 2 });
    fileIt.setJsonValue(file, "hello", "world", { spaces: 2 });
    const val = fileIt.getJsonValue(file, "hello");
    chai.expect(val).to.equal("world");
  });

  it("Validate updating multiple attributes", async function () {
    const file = path.join(TEST_DIR, 'tmp.json');
    fileIt.setJsonValue(file, "one", 1);
    fileIt.setJsonValue(file, "two", 2);
    fileIt.setJsonValue(file, "three", 3);

    const set1Val = fileIt.getJsonValue(file, "one");
    chai.expect(set1Val).to.equal(1);
    const set2Val = fileIt.getJsonValue(file, "two");
    chai.expect(set2Val).to.equal(2);
    const set3Val = fileIt.getJsonValue(file, "three");
    chai.expect(set3Val).to.equal(3);
  });

  it("Validate reading content async", async function () {
    const file = path.join(TEST_DIR, 'tmp.json');
    fileIt.setJsonValue(file, "one", 1);
    await fileIt.readContentFileAsync(file).then((content: string) => {
      expect(content.indexOf("one")).to.not.equal(-1);
    });
  })

});