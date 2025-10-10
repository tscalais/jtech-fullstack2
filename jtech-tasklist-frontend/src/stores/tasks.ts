import { defineStore } from 'pinia'
import type { Task } from '@/types'
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateFavorite,
} from '@/lib/api/client'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    activeTaskId: 0 as number,
    loading: false as boolean,
    error: '' as string,
  }),
  actions: {
    async fetchTasks(folderId: number) {
      this.loading = true
      this.error = ''
      try {
        debugger
        console.log('folderId',folderId)
        const data = await listTasks(folderId)
        this.tasks = data
        this.activeTaskId = data.length > 0 ? data[0].id : 0
      } catch (e: any) {
        this.error = e.message || 'Erro ao carregar tarefas'
      } finally {
        this.loading = false
      }
    },
    async createTask(folderId: number, task: Partial<Task>) {
      this.loading = true
      this.error = ''
      try {
        const newTask = await createTask(folderId, task)
        this.tasks.push(newTask)
        this.activeTaskId = newTask.id
        return newTask
      } catch (e: any) {
        this.error = e.message || 'Erro ao criar tarefa'
        throw e
      } finally {
        this.loading = false
      }
    },
    async updateTask(folderId: number, taskId: number, task: Partial<Task>) {
      this.loading = true
      this.error = ''
      try {
        const updated = await updateTask(folderId, taskId, task)
        const idx = this.tasks.findIndex(t => t.id === taskId)
        if (idx !== -1) this.tasks[idx] = updated
        return updated
      } catch (e: any) {
        this.error = e.message || 'Erro ao atualizar tarefa'
        throw e
      } finally {
        this.loading = false
      }
    },
    async deleteTask(folderId: number, taskId: number) {
      this.loading = true
      this.error = ''
      try {
        await deleteTask(folderId, taskId)
        this.tasks = this.tasks.filter(t => t.id !== taskId)
        if (this.activeTaskId === taskId) {
          this.activeTaskId = this.tasks.length > 0 ? this.tasks[0].id : 0
        }
      } catch (e: any) {
        this.error = e.message || 'Erro ao excluir tarefa'
        throw e
      } finally {
        this.loading = false
      }
    },
    async getTask(folderId: number, taskId: number) {
      this.loading = true
      this.error = ''
      try {
        return await getTask(folderId, taskId)
      } catch (e: any) {
        this.error = e.message || 'Erro ao buscar tarefa'
        throw e
      } finally {
        this.loading = false
      }
    },
    setActiveTask(id: number) {
      this.activeTaskId = id
    },
    async toggleFavorite(folderId: number, taskId: number) {
      this.loading = true
      this.error = ''
      try {
        const updated = await updateFavorite(folderId, taskId)
        const idx = this.tasks.findIndex(t => t.id === taskId)
        if (idx !== -1) this.tasks[idx] = updated
        return updated
      } catch (e: any) {
        this.error = e.message || 'Erro ao atualizar favorito'
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
