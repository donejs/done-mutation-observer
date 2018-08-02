var makeWindow = require("can-vdom/make-window/make-window");
var runTests = require("./run-tests");

runTests("can-vdom", () => makeWindow({}));
