var onChildAddedSymbol = Symbol.for("done.onChildAdded");

module.exports = function(Element) {
	var appendChild = Element.prototype.appendChild;
	Element.prototype.appendChild = function(node) {
		var res = appendChild.apply(this, arguments);
		if(this.ownerDocument) {
			this.ownerDocument[onChildAddedSymbol](node);
		}
		return res;
	};

	/*
	var insertBefore = Element.prototype.insertBefore;
	Element.prototype.insertBefore = function() {

	};

	var removeChild = Element.prototype.removeChild;
	Element.prototype.removeChild = function() {

	};

	return function() {
		Element.prototype.appendChild = appendChild;
		Element.prototype.insertBefore = insertBefore;
		Element.prototype.removeChild = removeChild;
	};
	*/
};
