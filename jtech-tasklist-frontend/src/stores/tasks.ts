import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { listTasks, getTask, createTask as apiCreateTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask, updateFavorite, updateTaskStatus } from '@/lib/api/client'
import { useFoldersStore } from './folders'
import type { TaskEntity } from '@/types/task'

export const useTasksStore = defineStore('tasks', () => {
  // ========== State ==========
  const tasks = ref<TaskEntity[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ========== Getters ==========
  const foldersStore = useFoldersStore()
  const tasksForCurrentFolder = computed(() => {
    return foldersStore.currentFolderId ? tasks.value.filter(t => t.folder.id === foldersStore.currentFolderId) : []
  })
  const completedTasks = computed(() => tasks.value.filter(t => t.completed))
  const pendingTasks = computed(() => tasks.value.filter(t => !t.completed))
  const totalTasks = computed(() => tasks.value.length)
  const taskById = computed(() => (id: number) => tasks.value.find(t => t.id === id))

  // ========== Actions ==========
  async function fetchTasks(folderId: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const data = await listTasks(folderId)
      // Remove tarefas antigas dessa pasta e adiciona as novas
      tasks.value = tasks.value.filter(t => t.folder.id !== folderId)
      tasks.value.push(...data)
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar tarefas'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTaskById(folderId: number, taskId: number): Promise<TaskEntity> {
    isLoading.value = true
    error.value = null
    try {
      const data = await getTask(folderId, taskId)
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = data
      } else {
        tasks.value.push(data)
      }
      return data
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar tarefa'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(folderId: number, task: Partial<TaskEntity>): Promise<TaskEntity> {
    isLoading.value = true
    error.value = null
    try {
      const newTask = await apiCreateTask(folderId, task)
      tasks.value.push(newTask)
      return newTask
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar tarefa'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateTask(folderId: number, taskId: number, task: Partial<TaskEntity>): Promise<TaskEntity> {
    isLoading.value = true
    error.value = null
    try {
      const updatedTask = await apiUpdateTask(folderId, taskId, task)
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      return updatedTask
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar tarefa'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteTask(folderId: number, taskId: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      await apiDeleteTask(folderId, taskId)
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value.splice(index, 1)
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao deletar tarefa'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function toggleFavorite(folderId: number, taskId: number): Promise<TaskEntity> {
    isLoading.value = true
    error.value = null
    try {
      const updatedTask = await updateFavorite(folderId, taskId)
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      return updatedTask
    } catch (err: any) {
      error.value = err.message || 'Erro ao favoritar tarefa'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function setTaskStatus(folderId: number, taskId: number, completed: boolean): Promise<TaskEntity> {
    isLoading.value = true
    error.value = null
    try {
      const updatedTask = await updateTaskStatus(folderId, taskId, { completed })
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      return updatedTask
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar status da tarefa'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    tasks,
    isLoading,
    error,
    tasksForCurrentFolder,
    completedTasks,
    pendingTasks,
    totalTasks,
    taskById,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    toggleFavorite,
    setTaskStatus
  }
})
