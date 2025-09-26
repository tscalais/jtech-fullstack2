import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

//Não importar o store no topo para evitar cache entre testes.
let useAutenticacaoStore: typeof import('../auth').useAutenticacaoStore

// Helper para mock de localStorage isolado por teste
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
    ;({ useAutenticacaoStore } = await import('../auth'))
  })

  it('login sucesso quando usuario===senha', async () => {
    const store = useAutenticacaoStore()
    const ok = store.entrar('alice','alice')
    // aguarda watch persistir
    await Promise.resolve()
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
