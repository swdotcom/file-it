import chai = require("chai");
import fs = require("fs");
import path = require("path");

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
    const file = path.join(TEST_DIR, 'tmp.json');
    fileIt.writeContentFileSync(file, "Hello World");
    const contentSaved = fileIt.readContentFileSync(file);
    chai.expect(contentSaved).to.equal("Hello World");
  });

  it("Validate content write", async function () {
    const file = path.join(TEST_DIR, 'tmp.json');

    await fileIt.writeContentFile(file, "Hello World", function (err: any) {
      chai.expect(err).to.be.null;
    });
  });

});