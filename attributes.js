var onAttributeSymbol = Symbol.for("done.onAttribute");

module.exports = function(Element) {
	var setAttribute = Element.prototype.setAttribute;
	Element.prototype.setAttribute = function(attrName) {
		var res = setAttribute.apply(this, arguments);
		if(this.ownerDocument && this.ownerDocument[onAttributeSymbol] !== undefined) {
			this.ownerDocument[onAttributeSymbol](this, attrName);
		}
		return res;
	};

	var removeAttribute = Element.prototype.removeAttribute;
	Element.prototype.removeAttribute = function(attrName) {
		var res = removeAttribute.apply(this, arguments);
		if(this.ownerDocument && this.ownerDocument[onAttributeSymbol] !== undefined) {
			this.ownerDocument[onAttributeSymbol](this, attrName);
		}
		return res;
	};

	return function() {
		Element.prototype.setAttribute = setAttribute;
		Element.prototype.removeAttribute = removeAttribute;
	};
};
