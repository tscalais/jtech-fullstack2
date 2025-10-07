import axios from 'axios'
import { useAutenticacaoStore } from '@/stores/auth'
import { getActivePinia } from 'pinia'
import type { Task } from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
})

// Interceptor para adicionar o header Authorization se o token existir
api.interceptors.request.use((config) => {
  // Não adicionar Authorization para login ou registro
  if (config.url?.startsWith('/auth')) {
    return config
  }
  // Buscar token diretamente do Pinia Store, se disponível
  let token = ''
  if (getActivePinia()) {
    try {
      const store = useAutenticacaoStore()
      token = store.token
    } catch {}
  }
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export async function listTasks(folderId: number): Promise<Task[]> {
  const { data } = await api.get(`/folders/${folderId}/tasks`)
  return data
}

export async function getTask(folderId: number, taskId: number): Promise<Task> {
  const { data } = await api.get(`/folders/${folderId}/tasks/${taskId}`)
  return data
}

export async function createTask(folderId: number, task: Partial<Task>): Promise<Task> {
  const { data } = await api.post(`/folders/${folderId}/tasks`, task)
  return data
}

export async function updateTask(folderId: number, taskId: number, task: Partial<Task>): Promise<Task> {
  const { data } = await api.put(`/folders/${folderId}/tasks/${taskId}`, task)
  return data
}

export async function deleteTask(folderId: number, taskId: number): Promise<void> {
  await api.delete(`/folders/${folderId}/tasks/${taskId}`)
}

export default api
