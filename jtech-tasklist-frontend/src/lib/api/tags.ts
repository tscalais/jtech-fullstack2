import api from './api'
import type { TagEntity } from '@/types'

export async function listTags(folderId: number): Promise<TagEntity[]> {
  const { data } = await api.get(`/folders/${folderId}/tags`)
  return data
}

export async function createTag(folderId: number, tag: Record<string, string>): Promise<TagEntity> {
  const { data } = await api.post(`/folders/${folderId}/tags`, tag)
  return data
}

export async function updateTag(folderId: number, tagId: number, tag: Record<string, string>): Promise<TagEntity> {
  const { data } = await api.put(`/folders/${folderId}/tags/${tagId}`, tag)
  return data
}

export async function deleteTag(folderId: number, tagId: number): Promise<void> {
  await api.delete(`/folders/${folderId}/tags/${tagId}`)
}

export async function associateTagToTask(taskId: number, tagId: number): Promise<void> {
  await api.post(`/tasks/${taskId}/tags/${tagId}`)
}

export async function dissociateTagFromTask(taskId: number, tagId: number): Promise<void> {
  await api.delete(`/tasks/${taskId}/tags/${tagId}`)
}

