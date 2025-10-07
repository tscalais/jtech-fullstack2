import { defineStore } from 'pinia'
import api from '@/lib/api/client'

export interface Folder {
  id: number
  name: string
  ownerId?: string
  ownerUsername?: string
  createdAt?: string
  updatedAt?: string
}

export const useFoldersStore = defineStore('folders', {
  state: () => ({
    folders: [] as Folder[],
    loading: false,
    error: '' as string | null,
    activeFolderId: localStorage.getItem('active-folder-id') ? Number(localStorage.getItem('active-folder-id')) : null,
  }),
  actions: {
    setActiveFolderId(id: number | null) {
      this.activeFolderId = id
      if (id !== null) {
        localStorage.setItem('active-folder-id', String(id))
      } else {
        localStorage.removeItem('active-folder-id')
      }
    },
    async fetchFolders() {
      this.loading = true
      this.error = ''
      try {
        const { data } = await api.get<Folder[]>('/folders')
        this.folders = data
        // Se não houver pastas ou a pasta ativa não existe mais, limpa a seleção
        if (!this.folders.length || !this.folders.some(f => f.id === this.activeFolderId)) {
          this.setActiveFolderId(null)
        }
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Erro ao buscar pastas.'
      } finally {
        this.loading = false
      }
    },
    async createFolder(folder: { name: string }) {
      this.loading = true
      this.error = ''
      try {
        const { data } = await api.post<Folder>('/folders', folder)
        this.folders.push(data)
        return data
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Erro ao criar pasta.'
        throw e
      } finally {
        this.loading = false
      }
    },
    async updateFolder(id: number, folder: { name: string }) {
      this.loading = true
      this.error = ''
      try {
        const { data } = await api.put<Folder>(`/folders/${id}`, folder)
        const idx = this.folders.findIndex(f => f.id === id)
        if (idx !== -1) this.folders[idx] = data
        return data
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Erro ao atualizar pasta.'
        throw e
      } finally {
        this.loading = false
      }
    },
    async deleteFolder(id: number) {
      this.loading = true
      this.error = ''
      try {
        await api.delete(`/folders/${id}`)
        this.folders = this.folders.filter(f => f.id !== id)
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Erro ao excluir pasta.'
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
