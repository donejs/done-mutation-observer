var installCharacterData = require("./characterData");
var MutationRecord = require("./mutation-record");

var mutationObserverSymbol = Symbol.for("done.MutationObserver");
var onCharacterDataSymbol = Symbol.for("done.onCharacterData");
var enqueuedMutationsSymbol = Symbol.for("done.enqueuedMutations");

var asap = Promise.resolve().then.bind(Promise.resolve());

exports.addMutationObserver = function(window) {
	var Node = window.Node;

	function MutationObserver(callback) {
		this.options = null;
		this.root = null;
		this.callback = callback;
		window[mutationObserverSymbol].add(this);
		this.records = [];
		this._enqueued = false;
	}

	MutationObserver.prototype.observe = function(root, options) {
		this.root = root;
		this.options = options;
	};

	MutationObserver.prototype._enqueue = function(record) {
		this.records.push(record);
		if(!this._enqueued) {
			this._enqueued = true;
			asap(function(){
				var records = this.records;
				this.records = [];
				this.callback.call(this, records);
			}.bind(this));
		}
	};

	window.MutationObserver = MutationObserver;
	window[mutationObserverSymbol] = new Set();

	function enqueue(record) {
		var mos = window[mutationObserverSymbol];
		var iter = mos[Symbol.iterator]();
		var res = iter.next();
		while(!res.done) {
			var mo = res.value;

			if(mo.root.contains(record.target)) {
				mo._enqueue(record);
			}

			res = iter.next();
		}
	}

	window.document[onCharacterDataSymbol] = function(node, oldValue) {
		var record = new MutationRecord();
		record.type = "characterData";
		record.target = node;

		enqueue(record);
	};

	// Do not add MutationObserver if already added.
	if(!Node[mutationObserverSymbol]) {
		Node[mutationObserverSymbol] = true;
		installCharacterData(Node);
	}

	return MutationObserver;
};

exports.removeMutationObserver = function(document){

};
