import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import GerenciadorLista from '@/components/GerenciadorLista.vue'

const baseListas = [
	{ id: 1, nome: 'Lista 1', criadaEm: Date.now() },
	{ id: 2, nome: 'Lista 2', criadaEm: Date.now() },
]

describe('GerenciadorLista', () => {
	it('renderiza título e listas', () => {
		const wrapper = mount(GerenciadorLista, { props: { listas: baseListas, idListaAtiva: 1 } })
		expect(wrapper.text()).toContain('Listas')
		expect(wrapper.text()).toContain('Lista 1')
		expect(wrapper.text()).toContain('Lista 2')
		expect(wrapper.findAll('input[type="text"]').length).toBe(1)
	})

	it('emite atualizar:listaAtiva ao clicar em outra lista', async () => {
		const wrapper = mount(GerenciadorLista, { props: { listas: baseListas, idListaAtiva: 1 } })
		const items = wrapper.findAllComponents({ name: 'VListItem' })
		await items[1].trigger('click')
		expect(wrapper.emitted('atualizar:listaAtiva')).toBeTruthy()
	})

	it('exibe actions (editar/excluir) para lista ativa', () => {
		const wrapper = mount(GerenciadorLista, { props: { listas: baseListas, idListaAtiva: 1 } })
		expect(wrapper.find('[data-testid="excluir-lista"]').element).toBeTruthy()
		expect(wrapper.find('[data-testid="editar-lista"]').element).toBeTruthy()
	})

	it('entra em modo edição e emite renomear:lista ao confirmar', async () => {
		const wrapper = mount(GerenciadorLista, { props: { listas: baseListas, idListaAtiva: 1 } })
		await wrapper.find('[data-testid="editar-lista"]').trigger('click')
		expect(wrapper.findAll('input[type="text"]').length).toBe(2)
		const editInput = wrapper.findAll('input[type="text"]').at(0)!
		await editInput.setValue('Lista 1 Renomeada')
		await editInput.trigger('keyup.enter')
		expect(wrapper.emitted('renomear:lista')).toBeTruthy()
		const payloads = wrapper.emitted('renomear:lista')!
		expect(payloads[payloads.length - 1][0]).toBe('Lista 1 Renomeada')
	})

	it('emite excluir:lista ao clicar no ícone de exclusão', async () => {
		const wrapper = mount(GerenciadorLista, { props: { listas: baseListas, idListaAtiva: 1 } })
		await wrapper.find('[data-testid="excluir-lista"]').trigger('click')
		expect(wrapper.emitted('excluir:lista')).toBeTruthy()
		const payload = wrapper.emitted('excluir:lista')![0][0]
		expect(payload).toBe(1)
	})
})
