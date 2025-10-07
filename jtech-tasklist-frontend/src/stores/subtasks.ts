import { useLocalStorage } from '@/composables/useLocalStorage'
import type { Subtask } from '@/types'
import { defineStore } from 'pinia'

const getNextId = (items: Subtask[]): number => {
  const ids = items.map((item) => item.id)
  const maxId = ids.length > 0 ? Math.max(...ids) : 0
  return maxId + 1
}

type SubtasksPorTaskId = { [taskId: number]: Subtask[] }
const subtasks: import('vue').Ref<SubtasksPorTaskId> = useLocalStorage('jtech-subtasks', {})

export const useSubtasksStore = defineStore('subtasks', {
  state: () => ({
    subtasks: subtasks.value,
  }),
  actions: {
    adicionarSubtask(taskId: number, name: string) {
      if (!this.subtasks[taskId]) {
        this.subtasks[taskId] = []
      }
      const nameJaExiste = this.subtasks[taskId].some(
        (subtask) => subtask.name.toLowerCase().trim() === name.toLowerCase().trim(),
      )
      if (nameJaExiste) {
        throw new Error(`Já existe uma sub tarefa "${name}" nesta tarefa`)
      }
      const novaSubtask: Subtask = {
        id: getNextId(this.subtasks[taskId]),
        taskId: taskId,
        name: name.trim(),
        concluida: false,
        createdAt: Date.now(),
      }
      this.subtasks[taskId].push(novaSubtask)
    },
    excluirSubtask(taskId: number, subtaskId: number) {
      if (this.subtasks[taskId]) {
        this.subtasks[taskId] = this.subtasks[taskId].filter((subtask) => subtask.id !== subtaskId)
      }
    },
    alternarSubtask(taskId: number, subtaskId: number) {
      const subtask = this.subtasks[taskId]?.find((subtask) => subtask.id === subtaskId)
      if (subtask) {
        subtask.concluida = !subtask.concluida
      }
      return subtask
    },
    editarSubtask(taskId: number, subtaskId: number, newName: string) {
      const nameJaExiste = this.subtasks[taskId]?.some(
        (subtask) => subtask.name.toLowerCase().trim() === newName.toLowerCase().trim() && subtask.id !== subtaskId,
      )
      if (nameJaExiste) {
        throw new Error(`Já existe uma subtask com o título "${newName}" nesta tarefa`)
      }
      const subtask = this.subtasks[taskId]?.find((subtask) => subtask.id === subtaskId)
      if (subtask) {
        subtask.name = newName.trim()
      }
    },
    excluirSubtasksPorTaskId(taskId: number) {
      delete this.subtasks[taskId]
    },
  },
})
