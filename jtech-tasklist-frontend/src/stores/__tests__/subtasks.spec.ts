import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
let useSubtasksStore: typeof import('../subtasks').useSubtasksStore

function mockLocalStorage() {
  const store: Record<string,string> = {}
  return {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] },
    clear: () => { Object.keys(store).forEach(k => delete store[k]) },
  }
}

describe('subtasks store', () => {
  beforeEach(async () => {
    vi.resetModules()
    setActivePinia(createPinia())
    Object.defineProperty(global, 'localStorage', { value: mockLocalStorage(), configurable: true })
    ;({ useSubtasksStore } = await import('../subtasks'))
  })

  it('adicionarSubtask cria nova subtask', () => {
    const store = useSubtasksStore()
    store.adicionarSubtask(1,'Estudar')
    expect(store.subtasks[1].length).toBe(1)
    expect(store.subtasks[1][0].name).toBe('Estudar')
  })

  it('adicionarSubtask duplicada lança erro', () => {
    const store = useSubtasksStore()
    store.adicionarSubtask(1,'Estudar')
    expect(() => store.adicionarSubtask(1,'estudar')).toThrow(/já existe/i)
  })

  it('alternarSubtask inverte concluida', () => {
    const store = useSubtasksStore()
    store.adicionarSubtask(1,'Estudar')
    const id = store.subtasks[1][0].id
    const t1 = store.alternarSubtask(1,id)
    expect(t1?.concluida).toBe(true)
    const t2 = store.alternarSubtask(1,id)
    expect(t2?.concluida).toBe(false)
  })

  it('editarSubtask altera nome', () => {
    const store = useSubtasksStore()
    store.adicionarSubtask(1,'Estudar')
    const id = store.subtasks[1][0].id
    store.editarSubtask(1,id,'Ler')
    expect(store.subtasks[1][0].name).toBe('Ler')
  })

  it('excluirSubtask remove subtask', () => {
    const store = useSubtasksStore()
    store.adicionarSubtask(1,'Estudar')
    const id = store.subtasks[1][0].id
    store.excluirSubtask(1,id)
    expect(store.subtasks[1].length).toBe(0)
  })

  it('excluirSubtasksPorTaskId remove todas as subtasks da tarefa', () => {
    const store = useSubtasksStore()
    store.adicionarSubtask(1,'Estudar')
    store.adicionarSubtask(1,'Ler')
    expect(store.subtasks[1].length).toBe(2)
    store.excluirSubtasksPorTaskId(1)
    expect(store.subtasks[1]).toBeUndefined()
  })
})
