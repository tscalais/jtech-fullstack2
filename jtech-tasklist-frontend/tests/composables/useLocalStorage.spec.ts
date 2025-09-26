import { describe, it, expect, beforeEach } from 'vitest'
import { useLocalStorage } from '@/composables/useLocalStorage'

function mockLocalStorage() {
	const store: Record<string,string> = {}
	return {
		getItem: (k: string) => (k in store ? store[k] : null),
		setItem: (k: string, v: string) => { store[k] = v },
		removeItem: (k: string) => { delete store[k] },
		clear: () => { Object.keys(store).forEach(k => delete store[k]) },
	}
}

describe('useLocalStorage', () => {
	beforeEach(() => {
		// @ts-expect-error mock
		global.localStorage = mockLocalStorage()
	})

	it('inicializa com valor default quando não há no storage', () => {
		const state = useLocalStorage('key-1', { a: 1 })
		expect(state.value).toEqual({ a: 1 })
	})

	it('persiste alterações', () => {
		const state = useLocalStorage('key-2', { count: 0 })
		state.value.count = 5
		return Promise.resolve().then(() => {
			expect(JSON.parse(localStorage.getItem('key-2')!)).toEqual({ count: 5 })
		})
	})

	it('reidrata de valor existente', () => {
		localStorage.setItem('key-3', JSON.stringify({ logged: true }))
		const state = useLocalStorage('key-3', { logged: false })
		expect(state.value).toEqual({ logged: true })
	})
})
