var QUnit = require("steal-qunit");
var moUtils = require("./done-mutation-observer");
var helpers = require("./test/helpers");

tests("can-simple-dom", helpers.setupCanVdom());

function tests(implName, window) {
	var document = window.document;

	var MutationObserver, testMutations;

	QUnit.module('done-mutation-observer ' + implName, {
		beforeEach: function(){
			MutationObserver = moUtils.addMutationObserver(window);
			testMutations = helpers.createContext(document, MutationObserver);
		},
		afterEach: function(){
			moUtils.removeMutationObserver(document);
		}
	});

	QUnit.test('Observes text mutations', function(assert){
		testMutations({
			build: function(doc){
				var div = doc.createElement("div");
				div.appendChild(doc.createTextNode("foo"));
				return div;
			},
			mutate: function(root, doc) {
				root.firstChild.nodeValue = "bar";
			},
			options: function() {
				return { subtree: true, characterData: true };
			},
			compare: function(root1, root2){
				return [
					[
						root1.firstChild.nodeValue,
						root2.firstChild.nodeValue,
						"Same nodeValue"
					]
				];
			}
		})
		.run(assert);
	});
}
