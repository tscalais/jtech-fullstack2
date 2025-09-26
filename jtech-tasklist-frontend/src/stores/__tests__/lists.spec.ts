import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
let useListasStore: typeof import('../lists').useListasStore

function mockLocalStorage() {
  const store: Record<string,string> = {}
  return {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] },
    clear: () => { Object.keys(store).forEach(k => delete store[k]) },
  }
}

describe('lists store', () => {
  beforeEach(async () => {
    vi.resetModules()
    setActivePinia(createPinia())
    // @ts-expect-error sobrescrevendo localStorage para isolar testes
    global.localStorage = mockLocalStorage()
    ;({ useListasStore } = await import('../lists'))
  })

  it('criarLista adiciona lista e define ativa', () => {
    const store = useListasStore()
    store.criarLista('Trabalho')
    expect(store.listas.length).toBe(1)
    expect(store.listas[0].nome).toBe('Trabalho')
    expect(store.listaAtivaId).toBe(store.listas[0].id)
  })

  it('criarLista com nome duplicado lança erro', () => {
    const store = useListasStore()
    store.criarLista('Trabalho')
    expect(() => store.criarLista('trabalho')).toThrow(/já existe/i)
  })

  it('renomearLista altera nome', () => {
    const store = useListasStore()
    store.criarLista('Old')
    const id = store.listas[0].id
    store.renomearLista(id,'Novo')
    expect(store.listas[0].nome).toBe('Novo')
  })

  it('renomearLista para duplicado lança erro', () => {
    const store = useListasStore()
    store.criarLista('Uma')
    store.criarLista('Duas')
    const id = store.listas.find(l => l.nome==='Uma')!.id
    expect(() => store.renomearLista(id,'duas')).toThrow(/já existe/i)
  })

  it('excluirLista remove e ajusta ativa', () => {
    const store = useListasStore()
    store.criarLista('A')
    store.criarLista('B')
    const idA = store.listas.find(l=>l.nome==='A')!.id
    store.excluirLista(idA)
    expect(store.listas.some(l=>l.id===idA)).toBe(false)
    expect(store.listaAtivaId).toBe(store.listas[0].id)
  })

  it('definirListaAtiva muda id', () => {
    const store = useListasStore()
    store.criarLista('A')
    store.criarLista('B')
    const idB = store.listas.find(l=>l.nome==='B')!.id
    store.definirListaAtiva(idB)
    expect(store.listaAtivaId).toBe(idB)
  })
})
