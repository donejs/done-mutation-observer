var QUnit = require("steal-qunit");
var helpers = require("./helpers");

module.exports = function(implName, window) {
	QUnit.module(implName + ' TextNode', helpers.addHooks(window));

	QUnit.test('Observes text mutations', function(assert){
		this.testMutations({
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

	QUnit.test("node.data is in sync with node.nodeValue", function(assert) {
		this.testMutations({
			build: function(doc) {
				var div = doc.createElement("div");
				var article = doc.createElement("article");
				article.textContent = "one";
				article.firstChild.data = "one";
				div.appendChild(article);
				return div;
			},
			mutate: function(root){
				root.firstChild.firstChild.nodeValue = "two";
			},
			options: function(){
				return { subtree: true, characterData: true };
			},
			test: function(records1, records2, equal) {
				equal(records => records.length);
				equal(records => records[0].target.nodeValue);
				equal(records => records[0].target.data);
			}
		})
		.run(assert);
	});
};
