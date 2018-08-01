var onChildListSymbol = Symbol.for("done.onChildList");

module.exports = function(Element) {
	var appendChild = Element.prototype.appendChild;
	Element.prototype.appendChild = function(node) {
		var res = appendChild.apply(this, arguments);
		if(this.ownerDocument) {
			this.ownerDocument[onChildListSymbol](this, node);
		}
		return res;
	};

	var insertBefore = Element.prototype.insertBefore;
	Element.prototype.insertBefore = function(node) {
		var res = insertBefore.apply(this, arguments);
		if(this.ownerDocument) {
			this.ownerDocument[onChildListSymbol](this, node);
		}
		return res;
	};

	var removeChild = Element.prototype.removeChild;
	Element.prototype.removeChild = function(node) {
		var res = removeChild.apply(this, arguments);
		if(this.ownerDocument) {
			this.ownerDocument[onChildListSymbol](this, null, node);
		}
		return res;
	};

	var replaceChild = Element.prototype.replaceChild;
	Element.prototype.replaceChild = function(newNode, oldNode) {
		var res = replaceChild.apply(this, arguments);
		if(this.ownerDocument) {
			this.ownerDocument[onChildListSymbol](this, newNode, oldNode);
		}
		return res;
	};

	return function() {
		Element.prototype.appendChild = appendChild;
		Element.prototype.insertBefore = insertBefore;
		Element.prototype.removeChild = removeChild;
		Element.prototype.replaceChild = replaceChild;
	};
};
