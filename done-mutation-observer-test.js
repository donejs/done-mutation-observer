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
				article.textContent = "original text";
				div.appendChild(article);
				return div;
			},
			mutate: function(root){
				root.firstChild.textContent = "hello world";
			},
			options: function(){
				return { subtree: true, childList: true };
			},
			test: function(records1, records2, equal) {
				equal(records => records.length);
				equal(records => records[0].addedNodes.length);
				equal(records => records[0].addedNodes[0].nodeType);
				equal(records => records[0].removedNodes.length, "Same number of removed nodes");
				equal(records => records[0].removedNodes[0].nodeType, "Removed node correct node type");
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

	QUnit.test("Observes insertBefore", function(assert) {
		testMutations({
			build: function(doc) {
				var div = doc.createElement("div");
				div.appendChild(doc.createElement("span"));
				div.appendChild(doc.createElement("ul"));
				return div;
			},
			mutate: function(root, doc) {
				root.insertBefore(doc.createElement("label"), root.firstChild.nextSibling);
			},
			options: function() {
				return { subtree: true, childList: true };
			},
			test: function(records1, records2, equal) {
				equal(records => records.length, "Correct number of records");
				equal(records => records[0].addedNodes.length);
				equal(records => records[0].removedNodes.length);
			}
		})
		.run(assert);
	});

	QUnit.test("Observes removeChild", function(assert) {
		testMutations({
			build: function(doc) {
				var div = doc.createElement("div");
				var child = doc.createElement("span");
				div.appendChild(child);
				return div;
			},
			mutate: function(root) {
				root.removeChild(root.firstChild);
			},
			options: function(){
				return { subtree: true, childList: true };
			},
			test: function(records1, records2, equal) {
				equal(records => records.length);
				equal(records => records[0].addedNodes.length);
				equal(records => records[0].removedNodes.length);
				equal(records => records[0].removedNodes[0].nodeName);
			}
		})
		.run(assert);
	});

	QUnit.module(implName + ' Attributes', addHooks());

	QUnit.test("Observes setAttribute when there is no existing attribute", function(assert) {
		testMutations({
			build: function(doc) {
				var div = doc.createElement("div");
				return div;
			},
			mutate: function(root) {
				root.setAttribute("id", "this-element");
			},
			options: function() {
				return { subtree: true, attributes: true };
			},
			test: function(records1, records2, equal) {
				equal(records => records.length, "Same number of records");
				equal(records => records[0].type);
				equal(records => records[0].attributeName);
			}
		})
		.run(assert);
	});

	QUnit.test("Observes setAttribute when there is an existing attribute", function(assert) {
		testMutations({
			build: function(doc) {
				var div = doc.createElement("div");
				div.setAttribute("id", "one");
				return div;
			},
			mutate: function(root) {
				root.setAttribute("id", "two");
			},
			options: function() {
				return { subtree: true, attributes: true };
			},
			test: function(records1, records2, equal) {
				equal(records => records.length, "Same number of records");
				equal(records => records[0].type);
				equal(records => records[0].attributeName);
			}
		})
		.run(assert);
	});

	QUnit.test("Observes removeAttribute", function(assert) {
		testMutations({
			build: function(doc) {
				var div = doc.createElement("div");
				div.setAttribute("id", "one");
				return div;
			},
			mutate: function(root) {
				root.removeAttribute("id");
			},
			options: function() {
				return { subtree: true, attributes: true };
			},
			test: function(records1, records2, equal) {
				equal(records => records.length);
				equal(records => records[0].type);
				equal(records => records[0].attributeName);
				equal(records => records[0].target.nodeName);
			}
		})
		.run(assert);
	});
}
