
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listSubtasks, createSubtask } from '@/lib/api/client'
import type { TaskEntity } from '@/types/task'

export const useSubtasksStore = defineStore('subtasks', () => {
  const subtasks = ref<TaskEntity[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSubtasks(folderId: number, taskId: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const data = await listSubtasks(folderId, taskId)
      subtasks.value = data
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar subtarefas'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function addSubtask(folderId: number, taskId: number, subtask: Partial<TaskEntity>): Promise<TaskEntity> {
    isLoading.value = true
    error.value = null
    try {
      const data = await createSubtask(folderId, taskId, subtask)
      subtasks.value.push(data)
      return data
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar subtarefa'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return { subtasks, isLoading, error, fetchSubtasks, addSubtask }
})
