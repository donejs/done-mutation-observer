var QUnit = require("steal-qunit");
var moUtils = require("./done-mutation-observer");
var helpers = require("./test/helpers");

tests("can-vdom", helpers.setupCanVdom());

function tests(implName, window) {
	var document = window.document;

	var MutationObserver, testMutations;

	function addHooks() {
		return {
			beforeEach: function(){
				MutationObserver = moUtils.addMutationObserver(window);
				testMutations = helpers.createContext(document, MutationObserver);
			},
			afterEach: function(){
				moUtils.removeMutationObserver(document);
			}
		};
	}

	QUnit.module(implName + ' TextNode', addHooks());

	QUnit.test('Observes text mutations', function(assert){
		testMutations({
			build: function(doc){
				var div = doc.createElement("div");
				div.appendChild(doc.createTextNode("foo"));
				return div;
			},
			mutate: function(root) {
				root.firstChild.nodeValue = "bar";
			},
			options: function() {
				return { subtree: true, characterData: true };
			},
			test: function(records1, records2){
				assert.equal(records1.length, records2.length);
				assert.equal(records1[0].type, records2[0].type);
				assert.equal(records1[0].target.nodeType, records2[0].target.nodeType);
				assert.equal(records1[0].target.nodeValue, records2[0].target.nodeValue);
			}
		})
		.run(assert);
	});

	QUnit.skip("Observes textContent changes", function(assert){
		testMutations({
			build: function(doc) {
				var div = doc.createElement("div");
				var article = doc.createElement("article");
				div.appendChild(article);
				return div;
			},
			mutate: function(root){
				root.firstChild.textContent = "hello world";
			},
			options: function(){
				return { subtree: true, childList: true };
			},
			test: function(records1, records2) {
				assert.equal(records1.length, records2.length);
			}
		})
		.run(assert);
	});

	QUnit.module(implName + ' childList', addHooks());

	QUnit.test("Observes appendChild", function(assert) {
		testMutations({
			build: function(doc) {
				var div = doc.createElement("div");
				var article = doc.createElement("article");
				div.appendChild(article);
				return div;
			},
			mutate: function(root, doc){
				root.firstChild.appendChild(doc.createElement("h1"));
			},
			options: function(){
				return { subtree: true, childList: true };
			},
			test: function(records1, records2) {
				assert.equal(records1.length, records2.length);
				assert.equal(records1[0].type, records2[0].type);
				assert.equal(records1[0].target.nodeName, records2[0].target.nodeName);
				assert.equal(records1[0].addedNodes.length, records2[0].addedNodes.length);
				assert.equal(records1[0].addedNodes[0].nodeName, records2[0].addedNodes[0].nodeName);
			}
		})
		.run(assert);
	});

	QUnit.test("Observes replaceChild", function(assert) {
		testMutations({
			build: function(doc) {
				var div = doc.createElement("div");
				var article = doc.createElement("article");
				div.appendChild(article);
				return div;
			},
			mutate: function(root, doc){
				root.replaceChild(doc.createElement("section"), root.firstChild);
			},
			options: function(){
				return { subtree: true, childList: true };
			},
			test: function(records1, records2) {
				assert.equal(records1.length, records2.length);
				assert.equal(records1[0].type, records2[0].type);
				assert.equal(records1[0].target.nodeName, records2[0].target.nodeName);
				assert.equal(records1[0].addedNodes.length, records2[0].addedNodes.length);
				assert.equal(records1[0].addedNodes[0].nodeName, records2[0].addedNodes[0].nodeName);
				assert.equal(records1[0].removedNodes.length, records2[0].removedNodes.length);
				assert.equal(records1[0].removedNodes[0].nodeName, records2[0].removedNodes[0].nodeName);
			}
		})
		.run(assert);
	});
}
