const main = require('./main')

describe('createStore', () => {
	test.each([
		undefined,
		true,
		false,
		null,
		0,
		1,
		0.1,
		{},
		Symbol('symbol'),
		[],
		'',
	])('should throw if reducer is not a function (is %p)', value => {
		expect(() => {
			main.createStore(value)
		}).toThrow()
	})
})

describe('replaceReducer', () => {
	test.each([
		undefined,
		true,
		false,
		null,
		1,
		0.1,
		{},
		Symbol('symbol'),
		[],
		'',
	])('should throw if reducer is not a function (is %p)', value => {
		let store = main.createStore(() => true)
		expect(() => {
			store.replaceReducer(value)
		}).toThrow()
	})
})

describe('subscribe', () => {
	test('return a callback', () => {
		let store = main.createStore(() => true)
		let unsubscribe = store.subscribe(() => { })
		expect(typeof unsubscribe).toEqual('function')
	})

	test('should support multiple subscribers', () => {
		let store = main.createStore(() => true)
		let subscriber = jest.fn()
		let subscriber2 = jest.fn()
		store.subscribe(subscriber)
		store.subscribe(subscriber2)

		expect(subscriber).toHaveBeenCalledTimes(0)
		expect(subscriber2).toHaveBeenCalledTimes(0)

		store.dispatch(1)

		expect(subscriber).toHaveBeenCalledTimes(1)
		expect(subscriber).toHaveBeenCalledWith(true)
		expect(subscriber2).toHaveBeenCalledTimes(1)
		expect(subscriber2).toHaveBeenCalledWith(true)
	})

	test('should not call unsubscribed callbacks', () => {
		let store = main.createStore((store, action) => action)
		let subscriber = jest.fn()
		let subscriber2 = jest.fn()
		let unsubscribe = store.subscribe(subscriber)
		store.subscribe(subscriber2)
		store.dispatch(1)

		expect(subscriber).toHaveBeenCalledTimes(1)
		expect(subscriber2).toHaveBeenCalledTimes(1)

		unsubscribe()

		store.dispatch(2)

		expect(subscriber).toHaveBeenCalledTimes(1)
		expect(subscriber2).toHaveBeenCalledTimes(2)
	})

	test('only removes relevant listener when unsubscribe is called', () => {
		let store = main.createStore((store, action) => action)
		let subscriber = jest.fn()
		let subscriber2 = jest.fn()
		let unsubscribe = store.subscribe(subscriber)
		store.subscribe(subscriber2)
		store.dispatch(1)

		unsubscribe()
		unsubscribe()
		unsubscribe()

		store.dispatch(2)

		expect(subscriber).toHaveBeenCalledTimes(1)
		expect(subscriber2).toHaveBeenCalledTimes(2)
	})

	test.each([
		undefined,
		true,
		false,
		null,
		0,
		1,
		0.1,
		{},
		Symbol('symbol'),
		[],
		'',
	])('should throw if subscriber is not a function (is %p)', value => {
		let store = main.createStore(() => true)
		expect(() => {
			store.subscribe(value)
		}).toThrow()
	})

	test('should call subscriber once even if it is registered multiple times', () => {
		let store = main.createStore(() => true)
		let subscriber = jest.fn()
		let unsubscribe = store.subscribe(subscriber)
		store.subscribe(subscriber)

		store.dispatch(1)

		expect(subscriber).toHaveBeenCalledTimes(1)

		unsubscribe()
		store.dispatch(2)

		expect(subscriber).toHaveBeenCalledTimes(1)
	})
});
