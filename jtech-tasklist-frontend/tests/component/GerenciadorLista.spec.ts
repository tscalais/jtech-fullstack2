import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import GerenciadorLista from '@/components/GerenciadorLista.vue'

const baseTasks = [
	{ id: 1, name: 'Task 1', createdAt: Date.now() },
	{ id: 2, name: 'Task 2', createdAt: Date.now() },
]

describe('GerenciadorLista', () => {
	it('renderiza título e tasks', () => {
		const wrapper = mount(GerenciadorLista, { props: { tasks: baseTasks, activeTaskId: 1 } })
		expect(wrapper.text()).toContain('Tarefas')
		expect(wrapper.text()).toContain('Task 1')
		expect(wrapper.text()).toContain('Task 2')
		expect(wrapper.findAll('input[type="text"]').length).toBe(1)
	})

	it('emite atualizar:taskAtiva ao clicar em outra task', async () => {
		const wrapper = mount(GerenciadorLista, { props: { tasks: baseTasks, activeTaskId: 1 } })
		const items = wrapper.findAllComponents({ name: 'VListItem' })
		await items[1].trigger('click')
		expect(wrapper.emitted('atualizar:taskAtiva')).toBeTruthy()
	})

	it('exibe actions (editar/excluir) para task ativa', () => {
		const wrapper = mount(GerenciadorLista, { props: { tasks: baseTasks, activeTaskId: 1 } })
		expect(wrapper.find('[data-testid="excluir-task"]').element).toBeTruthy()
		expect(wrapper.find('[data-testid="editar-task"]').element).toBeTruthy()
	})

	it('entra em modo edição e emite renomear:task ao confirmar', async () => {
		const wrapper = mount(GerenciadorLista, { props: { tasks: baseTasks, activeTaskId: 1 } })
		await wrapper.find('[data-testid="editar-task"]').trigger('click')
		expect(wrapper.findAll('input[type="text"]').length).toBe(2)
		const editInput = wrapper.findAll('input[type="text"]').at(0)!
		await editInput.setValue('Task 1 Renomeada')
		await editInput.trigger('keyup.enter')
		expect(wrapper.emitted('renomear:task')).toBeTruthy()
		const payloads = wrapper.emitted('renomear:task')!
		expect(payloads[payloads.length - 1][0]).toBe('Task 1 Renomeada')
	})

	it('emite excluir:task ao clicar no ícone de exclusão', async () => {
		const wrapper = mount(GerenciadorLista, { props: { tasks: baseTasks, activeTaskId: 1 } })
		await wrapper.find('[data-testid="excluir-task"]').trigger('click')
		expect(wrapper.emitted('excluir:task')).toBeTruthy()
		const payload = wrapper.emitted('excluir:task')![0][0]
		expect(payload).toBe(1)
	})
})
