class TestContext {
	constructor(document, MutationObserver, options) {
		this.document = document;
		this.MutationObserver = MutationObserver;
		this.options = options;
	}

	_ensureFixtureArea(document) {
		if(!document.getElementById("fixture-area")) {
			var div = document.createElement("div");
			div.setAttribute("id", "fixture-area");
			document.body.appendChild(div);
		}
	}

	_eachDocuments(cb) {
		return [this.document, window.document].forEach((doc, i) => cb.call(this, doc, i));
	}

	_mapDocuments(cb) {
		return [this.document, window.document].map(doc => cb.call(this, doc));
	}

	_mapObservers(cb) {
		return [this.MutationObserver, window.MutationObserver].map((MO, i) => cb.call(this, MO, i));
	}

	run(assert) {
		let context = this;
		let done = assert.async();

		this._ensureFixtureArea(this.document);
		this._ensureFixtureArea(window.document);

		let roots = this._mapDocuments(doc => {
			let root = this.options.build(doc);
			if(!root) {
				throw new Error("build() must return an Element");
			}
			return root;
		});

		function assertComparisions(results) {
			for(let [a, b, msg] of results) {
				assert.equal(a, b, msg);
			}
		}

		let calledBack = 0;
		function onMutations(records) {
			let MutationObserver = this;
			calledBack++;

			if(calledBack === 2) {
				let results = context.options.compare(roots[0], roots[1]);
				assertComparisions(results);
				done();
			}
		}

		let observers = this._mapObservers((MO, i) => {
			let options = this.options.options(MO);
			let observer = new MO(onMutations.bind(MO));
			observer.observe(roots[i], options);
			return observer;
		});

		this._eachDocuments((doc, i) => {
			this.options.mutate(roots[i], doc);
		});
	}
}

exports.createContext = function(document, MutationObserver) {
	return function(options){
		return new TestContext(document, MutationObserver, options);
	};
};

exports.setupCanVdom = function() {
	var makeWindow = require("can-vdom/make-window/make-window");
	return makeWindow({});
};
