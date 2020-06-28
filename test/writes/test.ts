import fs = require("fs");
import path = require("path");
import { expect } from "chai";

const fileIt = require("../../src");
const rimraf = require("rimraf");

describe("Json FileIt Write Tests", function () {
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

  it("Validate content write", function () {
    const file = path.join(TEST_DIR, 'tmp.txt');
    fileIt.writeContentFileSync(file, "Hello World");
    const contentSaved = fileIt.readContentFileSync(file);
    expect(contentSaved).to.equal("Hello World");
  });

  it("Validate content write", async function () {
    const file = path.join(TEST_DIR, 'tmp.txt');

    await fileIt.writeContentFile(file, "Hello World", function (err: any) {
      expect(err).to.be.null;
    });
  });

  it("Validate appending lines of json", async function () {
    const file = path.join(TEST_DIR, 'tmp.json');
    const obj1 = { hello: "world" };
    await fileIt.writeJsonFileSync(file, obj1);
    const obj2 = { foo: "baz" };
    await fileIt.writeJsonFileSync(file, obj2, { flag: "a" });

    const jsonArray = fileIt.readJsonLinesSync(file);
    expect(jsonArray.length).to.equal(2);
  })

});