import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Evitar cache entre testes importando dinamicamente
let useAutenticacaoStore: typeof import('@/stores/auth').useAutenticacaoStore

function mockLocalStorage() {
	const store: Record<string,string> = {}
	return {
		getItem: (k: string) => (k in store ? store[k] : null),
		setItem: (k: string, v: string) => { store[k] = v },
		removeItem: (k: string) => { delete store[k] },
		clear: () => { Object.keys(store).forEach(k => delete store[k]) },
	}
}

describe('auth store', () => {
	beforeEach(async () => {
		vi.resetModules()
		setActivePinia(createPinia())
		// @ts-expect-error mock localStorage
		global.localStorage = mockLocalStorage()
		;({ useAutenticacaoStore } = await import('@/stores/auth'))
	})

	it('login sucesso quando usuario===senha', async () => {
		const store = useAutenticacaoStore()
		const ok = store.entrar('alice','alice')
		await Promise.resolve() // aguarda persist
		expect(ok).toBe(true)
		expect(store.autenticado).toBe(true)
		expect(store.usuario?.nomeUsuario).toBe('alice')
		expect(JSON.parse(localStorage.getItem('auth-user')!)).toEqual({ nomeUsuario: 'alice' })
	})

	it('login falha quando credenciais inválidas', () => {
		const store = useAutenticacaoStore()
		const ok = store.entrar('alice','bob')
		expect(ok).toBe(false)
		expect(store.autenticado).toBe(false)
		expect(store.usuario).toBeNull()
	})

	it('sair limpa usuario e localStorage', async () => {
		const store = useAutenticacaoStore()
		store.entrar('x','x')
		await Promise.resolve()
		store.sair()
		expect(store.usuario).toBeNull()
		expect(localStorage.getItem('auth-user')).toBeNull()
	})
})
