var QUnit = require("steal-qunit");
var moUtils = require("./done-mutation-observer");
var SimpleDOM = require("can-simple-dom");

debugger;

tests("can-simple-dom", new SimpleDOM.Document());

function tests(implName, document) {
	var MutationObserver;

	QUnit.module('done-mutation-observer ' + implName, {
		beforeEach: function(){
			MutationObserver = moUtils.addMutationObserver(document);
		},
		afterEach: function(){
			moUtils.removeMutationObserver(document);
		}
	});

	QUnit.test('Observes text mutations', function(assert){
		var done = assert.async();

		var div = document.createElement("div");
		document.appendChild(div);

		var mo = new moUtils.MutationObserver(function(mutations) {

		});

		mo.observe(div, { characterData: true });

		div.appendChild(document.createTextNode("foo"));
	});
}
