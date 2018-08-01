var testCharacterData = require("./test-characterData");
var testChildList = require("./test-childList");
var testAttributes = require("./test-attributes");

module.exports = function(implName, window){
	testCharacterData(implName, window);
	testChildList(implName, window);
	testAttributes(implName, window);
};
