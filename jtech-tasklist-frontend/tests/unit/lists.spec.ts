import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
let useTasksStore: typeof import('@/stores/tasks').useTasksStore

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
		vi.stubGlobal('localStorage', mockLocalStorage())
		;({ useTasksStore } = await import('@/stores/tasks'))
	})

	it('createTask adiciona task e define ativa', () => {
		const store = useTasksStore()
		store.createTask('Trabalho')
		expect(store.tasks.length).toBe(1)
		expect(store.tasks[0].name).toBe('Trabalho')
		expect(store.activeTaskId).toBe(store.tasks[0].id)
	})

	it('createTask com nome duplicado lança erro', () => {
		const store = useTasksStore()
		store.createTask('Trabalho')
		expect(() => store.createTask('trabalho')).toThrow(/já existe/i)
	})

	it('renameTask altera nome', () => {
		const store = useTasksStore()
		store.createTask('Old')
		const id = store.tasks[0].id
		store.renameTask(id,'Novo')
		expect(store.tasks[0].name).toBe('Novo')
	})

	it('renameTask para duplicado lança erro', () => {
		const store = useTasksStore()
		store.createTask('Uma')
		store.createTask('Duas')
		const id = store.tasks.find(t => t.name==='Uma')!.id
		expect(() => store.renameTask(id,'duas')).toThrow(/já existe/i)
	})

	it('deleteTask remove e ajusta ativa', () => {
		const store = useTasksStore()
		store.createTask('A')
		store.createTask('B')
		const idA = store.tasks.find(t=>t.name==='A')!.id
		store.deleteTask(idA)
		expect(store.tasks.some(t=>t.id===idA)).toBe(false)
		expect(store.activeTaskId).toBe(store.tasks[0].id)
	})

	it('setActiveTask muda id', () => {
		const store = useTasksStore()
		store.createTask('A')
		store.createTask('B')
		const idB = store.tasks.find(t=>t.name==='B')!.id
		store.setActiveTask(idB)
		expect(store.activeTaskId).toBe(idB)
	})
})
