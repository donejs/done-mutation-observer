var childNodes = require("can-child-nodes");
var onChildListSymbol = Symbol.for("done.onChildList");

module.exports = function(Node) {
	var appendChild = Node.prototype.appendChild;
	Node.prototype.appendChild = function(node) {
		var nodes = collectNodes(node);
		var res = appendChild.apply(this, arguments);
		var doc = getDocument(this);
		if(doc) {
			doc[onChildListSymbol](this, nodes);
		}
		return res;
	};

	var insertBefore = Node.prototype.insertBefore;
	Node.prototype.insertBefore = function(node) {
		var nodes = collectNodes(node);
		var res = insertBefore.apply(this, arguments);
		var doc = getDocument(this);
		if(doc) {
			doc[onChildListSymbol](this, nodes);
		}
		return res;
	};

	var removeChild = Node.prototype.removeChild;
	Node.prototype.removeChild = function(node) {
		var res = removeChild.apply(this, arguments);
		var doc = getDocument(this);
		if(doc) {
			doc[onChildListSymbol](this, null, node);
		}
		return res;
	};

	var replaceChild = Node.prototype.replaceChild;
	Node.prototype.replaceChild = function(newNode, oldNode) {
		var nodes = collectNodes(newNode);
		var res = replaceChild.apply(this, arguments);
		var doc = getDocument(this);
		if(doc) {
			doc[onChildListSymbol](this, nodes, oldNode);
		}
		return res;
	};

	return function() {
		Node.prototype.appendChild = appendChild;
		Node.prototype.insertBefore = insertBefore;
		Node.prototype.removeChild = removeChild;
		Node.prototype.replaceChild = replaceChild;
	};
};

function collectNodes(node) {
	switch(node.nodeType) {
		// DocumentFragment
		case 11:
			return Array.from(childNodes(node));
		default:
			return [node];
	}
}

function getDocument(node) {
	switch(node.nodeType) {
		// Document node
		case 9:
			return node;
		default:
			return node.ownerDocument;
	}
}
