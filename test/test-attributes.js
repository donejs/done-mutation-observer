var QUnit = require("steal-qunit");
var helpers = require("./helpers");

module.exports = function(implName, window) {
	QUnit.module(implName + ' Attributes', helpers.addHooks(window));

	QUnit.test("Observes setAttribute when there is no existing attribute", function(assert) {
		this.testMutations({
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
		this.testMutations({
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
		this.testMutations({
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
};
