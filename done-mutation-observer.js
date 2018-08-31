var installCharacterData = require("./characterData");
var installChildList = require("./childList");
var installAttributes = require("./attributes");
var MutationRecord = require("./mutation-record");

var mutationObserverSymbol = Symbol.for("done.MutationObserver");
var onCharacterDataSymbol = Symbol.for("done.onCharacterData");
var onChildListSymbol = Symbol.for("done.onChildList");
var onAttributeSymbol = Symbol.for("done.onAttribute");

var asap = Promise.resolve().then.bind(Promise.resolve());

exports.addMutationObserver = function(window) {
	var Node = window.Node;
	var Element = window.Element;

	console.assert(Node, "Cannot install MutationObserver on a window without [Node]");
	console.assert(Element, "Cannot install MutationObserver on a window without [Element]");

	function MutationObserver(callback) {
		this.options = null;
		this.root = null;
		this.callback = callback;
		this.records = [];
		this._enqueued = false;
		this._connected = false;
	}

	MutationObserver.prototype.observe = function(root, options) {
		this.root = root;
		this.options = options;
		window[mutationObserverSymbol].add(this);
		this._connected = true;
	};

	MutationObserver.prototype.disconnect = function(){
		window[mutationObserverSymbol].delete(this);
		this._connected = false;
	};

	MutationObserver.prototype._enqueue = function(record) {
		this.records.push(record);
		if(!this._enqueued) {
			this._enqueued = true;
			asap(function(){
				if(!this._connected) {
					return;
				}
				
				this._enqueued = false;
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

			if(mo.root.contains(record.target) || mo.root === record.target) {
				mo._enqueue(record);
			}

			res = iter.next();
		}
	}

	window.document[onCharacterDataSymbol] = function(node) {
		var record = new MutationRecord();
		record.type = "characterData";
		record.target = node;
		enqueue(record);
	};

	window.document[onChildListSymbol] = function(parentNode, addedNodes, removedNode) {
		var record = new MutationRecord();
		record.type = "childList";
		record.target = parentNode;
		if(addedNodes) {
			record.addedNodes = addedNodes;
		}
		if(removedNode) {
			record.removedNodes.push(removedNode);
		}
		enqueue(record);
	};

	window.document[onAttributeSymbol] = function(node, attrName) {
		var record = new MutationRecord();
		record.type = "attributes";
		record.target = node;
		record.attributeName = attrName;
		enqueue(record);
	};

	// Do not add MutationObserver if already added.
	if(!Node[mutationObserverSymbol]) {
		Node[mutationObserverSymbol] = [
			installCharacterData(Node),
			installChildList(Node),
			installAttributes(Element)
		];
	}

	return MutationObserver;
};

exports.removeMutationObserver = function(window){
	var deregisterFunctions = window.Node[mutationObserverSymbol] || [];
	deregisterFunctions.forEach(function(deregister) {
		deregister();
	});
	delete window.Node[mutationObserverSymbol];
	delete window.MutationObserver;
};
