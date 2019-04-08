/**
 * Tests in this file are for bonus points. It is not required for them to pass
 * for submission.
 */
const main = require('./main')

describe('dispatch', () => {
	test('does not allow dispatch() from within a reducer', () => {
		let store = main.createStore((state, action) => {
			if (action === true) {
				return false
			}
			store.dispatch(true)
		})

		expect(() => {
			store.dispatch(false)
		}).toThrow()
	})

	test('does not allow getState() from within a reducer', () => {
		let store = main.createStore((state, action) => {
			return store.getState()
		})

		expect(() => {
			store.dispatch(false)
		}).toThrow()
	})

	test('does not allow subscribe() from within a reducer', () => {
		let store = main.createStore((state, action) => {
			return store.subscribe(() => {})
		})

		expect(() => {
			store.dispatch(false)
		}).toThrow()
	})

	test('does not allow unsubscribe from within a reducer', () => {
		let unsubscribe
		let store = main.createStore((state, action) => {
			unsubscribe()
			return action
		})
		unsubscribe = store.subscribe(() => {})

		expect(() => {
			store.dispatch(false)
		}).toThrow()
	})
})

describe('subscribe', () => {
	test('notifies all subscribers about current dispatch regardless if any of them gets unsubscribed in the process', () => {
		let store = main.createStore((store, action) => action)
		let spy = [jest.fn(), jest.fn(), jest.fn()]
		let unsubscribes = []

		function unsubscribeAll() {
			for (let unsubscribe of unsubscribes) {
				unsubscribe()
			}
		}

		for (let i = 0; i < spy.length; i++) {
			unsubscribes.push(
				store.subscribe(() => {
					spy[i]()
					unsubscribeAll()
				}),
			)
		}

		store.dispatch(1)

		for (let i = 0; i < spy.length; i++) {
			expect(spy[i]).toHaveBeenCalledTimes(1)
		}
	})

	it('uses the last snapshot of subscribers during nested dispatch', () => {
		const store = main.createStore((store, action) => action)

		const listener1 = jest.fn()
		const listener2 = jest.fn()
		const listener3 = jest.fn()
		const listener4 = jest.fn()

		let unsubscribe4
		const unsubscribe1 = store.subscribe(() => {
			listener1()
			expect(listener1).toHaveBeenCalledTimes(1)
			expect(listener2).toHaveBeenCalledTimes(0)
			expect(listener3).toHaveBeenCalledTimes(0)
			expect(listener4).toHaveBeenCalledTimes(0)

			unsubscribe1()
			unsubscribe4 = store.subscribe(listener4)
			store.dispatch(1)

			expect(listener1).toHaveBeenCalledTimes(1)
			expect(listener2).toHaveBeenCalledTimes(1)
			expect(listener3).toHaveBeenCalledTimes(1)
			expect(listener4).toHaveBeenCalledTimes(1)
		})
		store.subscribe(listener2)
		store.subscribe(listener3)

		store.dispatch(0)
		expect(listener1).toHaveBeenCalledTimes(1)
		expect(listener2).toHaveBeenCalledTimes(2)
		expect(listener3).toHaveBeenCalledTimes(2)
		expect(listener4).toHaveBeenCalledTimes(1)

		unsubscribe4()
		store.dispatch(2)
		expect(listener1).toHaveBeenCalledTimes(1)
		expect(listener2).toHaveBeenCalledTimes(3)
		expect(listener3).toHaveBeenCalledTimes(3)
		expect(listener4).toHaveBeenCalledTimes(1)
	})
})

