import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import GerenciadorLista from '../GerenciadorLista.vue'
import GerenciadorTarefas from '../GerenciadorTarefas.vue'

const tarefas = [
  { id: 1, listaId: 1, titulo: 'Tarefa 1', concluida: false, criadaEm: Date.now() },
  { id: 2, listaId: 1, titulo: 'Tarefa 2', concluida: true, criadaEm: Date.now() },
]

describe('GerenciadorTarefas', () => {
  it('renderiza o título', () => {
    const wrapper = mount(GerenciadorTarefas, {
      props: { tarefas },
    })
    expect(wrapper.text()).toContain('Tarefas')
  })

  it('renderiza as tarefas', () => {
    const wrapper = mount(GerenciadorTarefas, {
      props: { tarefas },
    })
    expect(wrapper.text()).toContain('Tarefa 1')
    expect(wrapper.text()).toContain('Tarefa 2')
  })

  it('emite evento ao alternar tarefa', async () => {
    const wrapper = mount(GerenciadorTarefas, {
      props: { tarefas },
    })
    await wrapper.findAllComponents({ name: 'ElCheckbox' })[0].vm.$emit('change')
    expect(wrapper.emitted('alternar:tarefa')).toBeTruthy()
  })
})

const listas = [
  { id: 1, nome: 'Lista 1', criadaEm: Date.now() },
  { id: 2, nome: 'Lista 2', criadaEm: Date.now() },
]

describe('GerenciadorLista', () => {
  it('renderiza o título', () => {
    const wrapper = mount(GerenciadorLista, {
      props: { listas, idListaAtiva: 1 },
    })
    expect(wrapper.text()).toContain('Listas')
  })

  it('renderiza as listas', () => {
    const wrapper = mount(GerenciadorLista, {
      props: { listas, idListaAtiva: 1 },
    })
    expect(wrapper.findAll('input[type="text"]').length).toBe(0)
    expect(wrapper.text()).toContain('Lista 1')
    expect(wrapper.text()).toContain('Lista 2')
  })

  it('emite evento ao clicar em uma lista', async () => {
    const wrapper = mount(GerenciadorLista, {
      props: { listas, idListaAtiva: 1 },
    })
    await wrapper.findAllComponents({ name: 'ElMenuItem' })[1].trigger('click')
    expect(wrapper.emitted('atualizar:listaAtiva')).toBeTruthy()
  })
})
