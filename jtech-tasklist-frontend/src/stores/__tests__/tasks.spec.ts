import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
let useTarefasStore: typeof import('../tasks').useTarefasStore

function mockLocalStorage() {
  const store: Record<string,string> = {}
  return {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] },
    clear: () => { Object.keys(store).forEach(k => delete store[k]) },
  }
}

describe('tasks store', () => {
  beforeEach(async () => {
    vi.resetModules()
    setActivePinia(createPinia())
    // @ts-expect-error sobrescrevendo localStorage
    global.localStorage = mockLocalStorage()
    ;({ useTarefasStore } = await import('../tasks'))
  })

  it('adicionarTarefa cria nova tarefa', () => {
    const store = useTarefasStore()
    store.adicionarTarefa(1,'Estudar')
    expect(store.tarefas[1].length).toBe(1)
    expect(store.tarefas[1][0].titulo).toBe('Estudar')
  })

  it('adicionarTarefa duplicada lança erro', () => {
    const store = useTarefasStore()
    store.adicionarTarefa(1,'Estudar')
    expect(() => store.adicionarTarefa(1,'estudar')).toThrow(/já existe/i)
  })

  it('alternarTarefa inverte concluida', () => {
    const store = useTarefasStore()
    store.adicionarTarefa(1,'Estudar')
    const id = store.tarefas[1][0].id
    const t1 = store.alternarTarefa(1,id)
    expect(t1?.concluida).toBe(true)
    const t2 = store.alternarTarefa(1,id)
    expect(t2?.concluida).toBe(false)
  })

  it('editarTarefa altera título', () => {
    const store = useTarefasStore()
    store.adicionarTarefa(1,'Estudar')
    const id = store.tarefas[1][0].id
    store.editarTarefa(1,id,'Ler')
    expect(store.tarefas[1][0].titulo).toBe('Ler')
  })

  it('editarTarefa para duplicado lança erro', () => {
    const store = useTarefasStore()
    store.adicionarTarefa(1,'Estudar')
    store.adicionarTarefa(1,'Ler')
    const id = store.tarefas[1].find(t=>t.titulo==='Estudar')!.id
    expect(() => store.editarTarefa(1,id,'ler')).toThrow(/já existe/i)
  })

  it('excluirTarefa remove tarefa', () => {
    const store = useTarefasStore()
    store.adicionarTarefa(1,'Estudar')
    const id = store.tarefas[1][0].id
    store.excluirTarefa(1,id)
    expect(store.tarefas[1].length).toBe(0)
  })

  it('excluirTarefasPorListaId remove todas as tarefas da lista', () => {
    const store = useTarefasStore()
    store.adicionarTarefa(1,'A')
    store.adicionarTarefa(1,'B')
    store.excluirTarefasPorListaId(1)
    expect(store.tarefas[1]).toBeUndefined()
  })
})
