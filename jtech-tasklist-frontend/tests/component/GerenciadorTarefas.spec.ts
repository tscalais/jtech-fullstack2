import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import GerenciadorTarefas from '@/components/GerenciadorTarefas.vue'

const baseTarefas = [
  { id: 1, listaId: 1, titulo: 'Tarefa 1', concluida: false, criadaEm: Date.now() },
  { id: 2, listaId: 1, titulo: 'Tarefa 2', concluida: true, criadaEm: Date.now() },
]

describe('GerenciadorTarefas', () => {
  it('renderiza título e tarefas', () => {
    const wrapper = mount(GerenciadorTarefas, { props: { tarefas: baseTarefas } })
    expect(wrapper.text()).toContain('Tarefas')
    expect(wrapper.text()).toContain('Tarefa 1')
    expect(wrapper.text()).toContain('Tarefa 2')
  })

  it('emite alternar:tarefa ao clicar no checkbox', () => {
    const wrapper = mount(GerenciadorTarefas, { props: { tarefas: baseTarefas } })
    const firstCheckbox = wrapper.findAllComponents({ name: 'VCheckboxBtn' })[0]
    firstCheckbox.vm.$emit('update:modelValue')
    expect(wrapper.emitted('alternar:tarefa')).toBeTruthy()
    const payload = wrapper.emitted('alternar:tarefa')![0][0]
    expect(payload).toBe(1)
  })

  it('emite adicionar:tarefa ao submeter texto válido', async () => {
    const wrapper = mount(GerenciadorTarefas, { props: { tarefas: baseTarefas } })
    const input = wrapper.find('input')
    await input.setValue('Nova tarefa')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted('adicionar:tarefa')).toBeTruthy()
    const payload = wrapper.emitted('adicionar:tarefa')![0][0]
    expect(payload).toBe('Nova tarefa')
  })

  it('não emite adicionar:tarefa para texto vazio', async () => {
    const wrapper = mount(GerenciadorTarefas, { props: { tarefas: baseTarefas } })
    const input = wrapper.find('input')
    await input.setValue('   ')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted('adicionar:tarefa')).toBeFalsy()
  })

  it('emite excluir:tarefa ao clicar no ícone de exclusão', async () => {
    const wrapper = mount(GerenciadorTarefas, { props: { tarefas: baseTarefas } })
    const deleteSpans = wrapper.findAll('span')
    // procura span que contém o ícone mdi-delete-circle dentro
    const target = deleteSpans.find(s => s.html().includes('mdi-delete-circle'))
    await target!.trigger('click')
    expect(wrapper.emitted('excluir:tarefa')).toBeTruthy()
    const payload = wrapper.emitted('excluir:tarefa')![0][0]
    expect(payload).toBe(1)
  })

  it('mantém input limpo após adicionar', async () => {
    const wrapper = mount(GerenciadorTarefas, { props: { tarefas: baseTarefas } })
    const input = wrapper.find('input')
    await input.setValue('Outra tarefa')
    await wrapper.find('form').trigger('submit.prevent')
    expect((input.element as HTMLInputElement).value).toBe('')
  })
})
