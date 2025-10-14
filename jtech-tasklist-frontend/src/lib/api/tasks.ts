import api from './api'
import type { TaskEntity } from '@/types'

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

export async function updateTaskStatus(folderId: number, taskId: number): Promise<TaskEntity> {
  const { data } = await api.patch(`/folders/${folderId}/tasks/${taskId}/completed`)
  return data
}

export async function updateFavorite(folderId: number, taskId: number): Promise<TaskEntity> {
  const { data } = await api.patch(`/folders/${folderId}/tasks/${taskId}/favorite`)
  return data
}

export async function listSubtasks(folderId: number, taskId: number): Promise<TaskEntity[]> {
  const { data } = await api.get(`/folders/${folderId}/tasks/${taskId}/subtasks`)
  return data
}

export async function createSubtask(folderId: number, taskId: number, subtask: Partial<TaskEntity>): Promise<TaskEntity> {
  const { data } = await api.post(`/folders/${folderId}/tasks/${taskId}/subtasks`, subtask)
  return data
}

