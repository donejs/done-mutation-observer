
function MutationRecord() {
	this.addedNodes = [];
	this.attributeName = null;
	this.attributeNamespace = null;
	this.nextSibling = null;
	this.oldValue = null;
	this.previousSibling = null;
	this.removedNodes = [];
	this.target = null;
	this.type = null;
}

module.exports = MutationRecord;
