var JSDOM = require("jsdom").JSDOM;
var runTests = require("./run-tests");

runTests("jsdom", () => new JSDOM().window);
