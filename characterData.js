var noop = Function.prototype;

var onCharacterDataSymbol = Symbol.for("done.onCharacterData");

module.exports = function(Node) {
	var origDesc = Object.getOwnPropertyDescriptor(Node.prototype, "nodeValue");
	var desc = origDesc;
	if(desc == null) {
		desc = { get: noop, set: noop };
	}

	var _priv = Symbol("nodeValue");
	Object.defineProperty(Node.prototype, "nodeValue", {
		configurable: true,
		set: function(val){
			var oldValue = this[_priv];
			this[_priv] = val;

			if(this.ownerDocument/* && this.ownerDocument.contains(this)*/) {
				this.ownerDocument[onCharacterDataSymbol](this, oldValue);
			}
		},
		get: function(){
			return this[_priv];
		}
	});

	return function(){
		if(origDesc) {
			Object.defineProperty(Node.prototype, "nodeValue", origDesc);
		}
	};
};
