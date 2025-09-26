import { useLocalStorage } from '@/composables/useLocalStorage'
import type { Tarefa } from '@/types'
import { defineStore } from 'pinia'

const getNextId = (items: Tarefa[]): number => {
  const ids = items.map((item) => item.id)
  const maxId = ids.length > 0 ? Math.max(...ids) : 0
  return maxId + 1
}

type TarefasPorListaId = { [listaId: number]: Tarefa[] }
const tarefas: import('vue').Ref<TarefasPorListaId> = useLocalStorage('jtech-tasks', {})

export const useTarefasStore = defineStore('tarefas', {
  state: () => ({
    tarefas: tarefas.value,
  }),
  actions: {
    adicionarTarefa(listaId: number, titulo: string) {
      if (!this.tarefas[listaId]) {
        this.tarefas[listaId] = []
      }

      const tituloJaExiste = this.tarefas[listaId].some(
        (tarefa) => tarefa.titulo.toLowerCase().trim() === titulo.toLowerCase().trim(),
      )

      if (tituloJaExiste) {
        throw new Error(`Já existe uma tarefa com o título "${titulo}" nesta lista`)
      }

      const novaTarefa: Tarefa = {
        id: getNextId(this.tarefas[listaId]),
        listaId,
        titulo: titulo.trim(),
        concluida: false,
        criadaEm: Date.now(),
      }
      this.tarefas[listaId].push(novaTarefa)
    },
    excluirTarefa(listaId: number, tarefaId: number) {
      if (this.tarefas[listaId]) {
        this.tarefas[listaId] = this.tarefas[listaId].filter((tarefa) => tarefa.id !== tarefaId)
      }
    },
    alternarTarefa(listaId: number, tarefaId: number) {
      const tarefa = this.tarefas[listaId]?.find((tarefa) => tarefa.id === tarefaId)
      if (tarefa) {
        tarefa.concluida = !tarefa.concluida
      }
      return tarefa
    },
    editarTarefa(listaId: number, tarefaId: number, novoTitulo: string) {
      const tituloJaExiste = this.tarefas[listaId]?.some(
        (tarefa) =>
          tarefa.id !== tarefaId &&
          tarefa.titulo.toLowerCase().trim() === novoTitulo.toLowerCase().trim(),
      )

      if (tituloJaExiste) {
        throw new Error(`Já existe uma tarefa com o título "${novoTitulo}" nesta lista`)
      }

      const tarefa = this.tarefas[listaId]?.find((tarefa) => tarefa.id === tarefaId)
      if (tarefa) {
        tarefa.titulo = novoTitulo.trim()
      }
    },
    excluirTarefasPorListaId(listaId: number) {
      delete this.tarefas[listaId]
    },
  },
})
