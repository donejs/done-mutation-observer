var QUnit = require("steal-qunit");
var helpers = require("./helpers");
var moUtils = require("../done-mutation-observer");

module.exports = function(implName, window, makeWindow) {
	QUnit.module(implName + ' removeMutationObserver', helpers.addHooks(makeWindow()));

	QUnit.test('Removes the monkey patching', function(assert) {
		moUtils.removeMutationObserver(window);

		var newWindow = makeWindow();
		var doc = newWindow.document;

		doc.body.appendChild(doc.createElement('span'));
		assert.ok(true, 'Able to create a new document and manipulate it.');
	});

	QUnit.test('Works even if another document isn\'t being observed', function(assert) {
		var doc = makeWindow().document;

		try {
			doc.body.appendChild(doc.createElement('span'));
			assert.ok(true, "Able to work with docs that are not being observed.");
		} catch(err) {
			assert.ok(!err, err);
		}

	});
};
