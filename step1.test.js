const main = require('./main')

describe('createStore', () => {
	test('can set initial state', () => {
		const initialState = { test: true }
		let store = main.createStore(() => null, initialState)
		expect(store.getState()).toEqual(initialState)
	})

	test('without giving initialState, the state should be undefined', () => {
		let store = main.createStore(() => null)
		expect(store.getState()).toBeUndefined()
	})
})

describe('dispatch', () => {
	test('should throw if action is undefined', () => {
		let store = main.createStore(() => true)

		expect(() => {
			store.dispatch()
		}).toThrow()
	})

	test.each([true, false, null, 0, 1, 0.1, {}, Symbol('symbol'), [], ''])(
		'should call the reducer with previous state and action when given action of type %p',
		action => {
			let spy = jest.fn()
			const initialState = { test: true }

			let store = main.createStore(spy, initialState)
			store.dispatch(action)

			expect(spy).toHaveBeenCalledTimes(1)
			expect(spy).toHaveBeenCalledWith(initialState, action)
		},
	)

	test('supply the initial state even if it is not given on store creation', () => {
		let spy = jest.fn()
		const action = Symbol('action')

		let store = main.createStore(spy)
		store.dispatch(action)

		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith(undefined, action)
	})

	test('change the store to the return value', () => {
		let store = main.createStore(() => true)

		expect(store.getState()).not.toEqual(true)
		store.dispatch(1)
		expect(store.getState()).toEqual(true)
	})
})

describe('replaceReducer', () => {
	test('replace reducer with the given one', () => {
		let store = main.createStore(() => true)
		store.dispatch(1)
		expect(store.getState()).toEqual(true)

		store.replaceReducer(() => false)
		store.dispatch(1)
		expect(store.getState()).toEqual(false)
	})

	test('preserve state when replacing reducer', () => {
		let store = main.createStore(() => true)
		store.dispatch(1)
		expect(store.getState()).toEqual(true)

		store.replaceReducer(() => false)
		expect(store.getState()).toEqual(true)
	})
})

describe('subscribe', () => {
	test('should call subscriber with latest value', () => {
		let store = main.createStore(() => true)
		let subscriber = jest.fn()
		store.subscribe(subscriber)

		expect(subscriber).toHaveBeenCalledTimes(0)

		store.dispatch(1)

		expect(subscriber).toHaveBeenCalledTimes(1)
		expect(subscriber).toHaveBeenCalledWith(true)
	})
});
