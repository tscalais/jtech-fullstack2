import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import GerenciadorTarefas from '../GerenciadorTarefas.vue'

const tarefas = [
  { id: 1, listaId: 1, titulo: 'Tarefa 1', concluida: false, criadaEm: Date.now() },
  { id: 2, listaId: 1, titulo: 'Tarefa 2', concluida: true, criadaEm: Date.now() },
]

describe('GerenciadorTarefas', () => {
  it('renderiza o título', () => {
    const wrapper = mount(GerenciadorTarefas, { props: { tarefas } })
    expect(wrapper.text()).toContain('Tarefas')
  })

  it('renderiza as tarefas', () => {
    const wrapper = mount(GerenciadorTarefas, { props: { tarefas } })
    expect(wrapper.text()).toContain('Tarefa 1')
    expect(wrapper.text()).toContain('Tarefa 2')
  })

  it('emite evento ao alternar tarefa', async () => {
    const wrapper = mount(GerenciadorTarefas, { props: { tarefas } })
    const checkbox = wrapper.findAllComponents({ name: 'VCheckboxBtn' })[0]
    checkbox.vm.$emit('update:modelValue')
    expect(wrapper.emitted('alternar:tarefa')).toBeTruthy()
  })
})
