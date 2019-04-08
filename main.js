class Store {
	constructor(reducer, initialState) {
		this.reducer = reducer
		this.state = initialState
	}

	getState() {
		return this.state;
	}

	dispatch(action) {
		if (action == undefined) {
			throw ("action is undefined")
		}

		this.state = this.reducer(this.state, action)
	}

	subscribe(listener) {
		if (typeof listener != "function") {
			throw "listener is not a function"
		}
		if (typeof listener == "function") {
			return listener
		}
	}
	unsubscribe(){
		
	}

	replaceReducer(nextReducer) {
		if (typeof nextReducer != "function") {
			throw "nextReducer is not a function"
		}
		this.reducer = nextReducer;
	}
}

function createStore(reducer, initialState) {
	if (typeof reducer != "function") {
		throw "reducer is not a function"
	}
	return new Store(reducer, initialState)
}

exports.createStore = createStore
