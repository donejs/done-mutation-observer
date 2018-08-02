var testCharacterData = require("./test-characterData");
var testChildList = require("./test-childList");
var testAttributes = require("./test-attributes");
var testAPI = require("./test-api");

module.exports = function(implName, makeWindow){
	var window = makeWindow();

	testCharacterData(implName, window);
	testChildList(implName, window);
	testAttributes(implName, window);
	testAPI(implName, window, makeWindow);
};
