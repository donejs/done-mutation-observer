var QUnit = require("steal-qunit");
var helpers = require("./helpers");

module.exports = function(implName, window) {
	QUnit.module(implName + ' childList', helpers.addHooks(window));

	QUnit.test("Observes appendChild", function(assert) {
		this.testMutations({
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
		this.testMutations({
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
		this.testMutations({
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
		this.testMutations({
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

	QUnit.test("DocumentFragment insertions", function(assert) {
		this.testMutations({
			build: function(doc) {
				var div = doc.createElement("div");
				return div;
			},
			mutate: function(root, doc) {
				var frag = doc.createDocumentFragment();
				frag.appendChild(doc.createElement("span"));
				frag.appendChild(doc.createElement("ul"));
				root.appendChild(frag);
			},
			options: function(){
				return { subtree: true, childList: true };
			},
			test: function(records1, records2, equal) {
				equal(records => records.length);
				equal(records => records[0].addedNodes.length);
				equal(records => records[0].addedNodes[0].nodeName);
				equal(records => records[0].addedNodes[1].nodeName);
			}
		})
		.run(assert);
	});
};
