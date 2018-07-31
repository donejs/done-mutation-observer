var mutationObserverSymbol = Symbol.for("done.MutationObserver");

exports.addMutationObserver = function(document) {
	var docProto = Object.getPrototypeOf(document);

	function MutationObserver() {
		this.options = null;
		this.root = null;
	}

	MutationObserver.prototype.observe = function(root, options) {
		this.root = root;
		this.options = options;
	};

	docProto[mutationObserverSymbol] = MutationObserver;

	return MutationObserver;
};

exports.removeMutationObserver = function(document){

};
