import api from './api'
import type { FolderResponse, FolderRequest } from '@/types'

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

