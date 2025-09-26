import { describe, it, expect, beforeEach, vi } from 'vitest'
import router from '../index'
import { setActivePinia, createPinia } from 'pinia'
import { useAutenticacaoStore } from '@/stores/auth'

function mockLocalStorage() {
  const store: Record<string,string> = {}
  return {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] },
    clear: () => { Object.keys(store).forEach(k => delete store[k]) },
  }
}

describe('route guard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // @ts-expect-error mock
    global.localStorage = mockLocalStorage()
  })

  it('bloqueia acesso a /tarefas sem login e redireciona para /login', async () => {
    await router.push('/login')
    await router.isReady()
    await router.push('/tarefas')
    // guard deve redirecionar
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('permite acesso a /tarefas quando autenticado', async () => {
    const auth = useAutenticacaoStore()
    auth.entrar('a','a')
    await router.push('/tarefas')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('painel-tarefas')
  })
})
