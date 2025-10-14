import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { getActivePinia } from 'pinia'
import type { TaskEntity, Subtask } from '@/types/task'
import type { FolderResponse, FolderRequest } from '@/types/folder'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
})

// Interceptor para adicionar o header Authorization se o token existir
api.interceptors.request.use((config) => {
  if (config.url?.startsWith('/auth')) {
    return config
  }
  let token: string | null = ''
  if (getActivePinia()) {
    try {
      const store = useAuthStore()
      token = store.token
    } catch {}
  }
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// FOLDERS
export async function listFolders(): Promise<FolderResponse[]> {
  const { data } = await api.get('/folders')
  return data
}

export async function getFolder(id: number): Promise<FolderResponse> {
  const { data } = await api.get(`/folders/${id}`)
  return data
}

export async function createFolder(folder: FolderRequest): Promise<FolderResponse> {
  const { data } = await api.post('/folders', folder)
  return data
}

export async function updateFolder(id: number, folder: FolderRequest): Promise<FolderResponse> {
  const { data } = await api.put(`/folders/${id}`, folder)
  return data
}

export async function deleteFolder(id: number): Promise<void> {
  await api.delete(`/folders/${id}`)
}

// TASKS
export async function listTasks(folderId: number): Promise<TaskEntity[]> {
  const { data } = await api.get(`/folders/${folderId}/tasks`)
  return data
}

export async function getTask(folderId: number, taskId: number): Promise<TaskEntity> {
  const { data } = await api.get(`/folders/${folderId}/tasks/${taskId}`)
  return data
}

export async function createTask(folderId: number, task: Partial<TaskEntity>): Promise<TaskEntity> {
  const { data } = await api.post(`/folders/${folderId}/tasks`, task)
  return data
}

export async function updateTask(folderId: number, taskId: number, task: Partial<TaskEntity>): Promise<TaskEntity> {
  const { data } = await api.put(`/folders/${folderId}/tasks/${taskId}`, task)
  return data
}

export async function deleteTask(folderId: number, taskId: number): Promise<void> {
  await api.delete(`/folders/${folderId}/tasks/${taskId}`)
}

export async function updateFavorite(folderId: number, taskId: number): Promise<TaskEntity> {
  const { data } = await api.patch(`/folders/${folderId}/tasks/${taskId}/favorite`)
  return data
}

export async function updateTaskStatus(folderId: number, taskId: number, status: { completed: boolean }): Promise<TaskEntity> {
  const { data } = await api.patch(`/folders/${folderId}/tasks/${taskId}/status`, status)
  return data
}

// SUBTASKS
export async function listSubtasks(taskId: number): Promise<Subtask[]> {
  const { data } = await api.get(`/api/subtasks/task/${taskId}`)
  return data
}

export async function getSubtask(id: number): Promise<Subtask> {
  const { data } = await api.get(`/api/subtasks/${id}`)
  return data
}

export async function createSubtask(taskId: number, subtask: Partial<Subtask>): Promise<Subtask> {
  const { data } = await api.post(`/api/subtasks/task/${taskId}`, subtask)
  return data
}

export async function updateSubtask(id: number, subtask: Partial<Subtask>): Promise<Subtask> {
  const { data } = await api.put(`/api/subtasks/${id}`, subtask)
  return data
}

export async function deleteSubtask(id: number): Promise<void> {
  await api.delete(`/api/subtasks/${id}`)
}

// AUTENTICAÇÃO
export interface AuthRequest {
  userName: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserRequest {
  userName: string;
  password: string;
  fullName: string;
}

export interface UserDTO {
  id: string;
  userName: string;
  password: string;
  fullName: string;
}

export async function login(data: AuthRequest): Promise<AuthResponse> {
  const { data: response } = await api.post('/auth/login', data)
  return response
}

export async function register(data: UserRequest): Promise<UserDTO> {
  const { data: response } = await api.post('/auth/register', data)
  return response
}

export async function validateToken(token: string): Promise<void> {
  await api.get('/auth/validate', { headers: { Authorization: `Bearer ${token}` } })
}

export async function getCurrentUser(token: string): Promise<UserDTO> {
  const { data } = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
  return data
}

export async function resetPassword(userName: string): Promise<void> {
  const data: AuthRequest = { userName, password: userName }
  await api.post('/auth/reset-password', data)
}

export default api
