import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  listFolders,
  getFolder,
  createFolder as apiCreateFolder,
  updateFolder as apiUpdateFolder,
  deleteFolder as apiDeleteFolder,
} from '@/lib/api/folders'
import type { FolderResponse, FolderRequest } from '@/types/folder'

export const useFoldersStore = defineStore('folders', () => {
  // ========== State ==========
  const folders = ref<FolderResponse[]>([])
  const currentFolderId = ref<number | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ========== Getters ==========
  const currentFolder = computed(() => folders.value.find((f) => f.id === currentFolderId.value))

  const currentFolderName = computed(() => currentFolder.value?.name || 'Pasta')

  const sortedFolders = computed(() =>
    [...folders.value].sort((a, b) => a.name.localeCompare(b.name)),
  )

  const totalFolders = computed(() => folders.value.length)

  // ========== Actions ==========

  /**
   * Busca todas as pastas do usuário
   */
  async function fetchFolders(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const data = await listFolders()
      folders.value = data

      // Define a primeira pasta como atual se não houver uma selecionada
      if (!currentFolderId.value && folders.value.length > 0) {
        currentFolderId.value = folders.value[0].id
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar pastas'
      console.error('Erro ao buscar pastas:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Busca uma pasta específica por ID
   */
  async function fetchFolderById(id: number): Promise<FolderResponse> {
    isLoading.value = true
    error.value = null

    try {
      const data = await getFolder(id)

      // Atualiza ou adiciona a pasta na lista
      const index = folders.value.findIndex((f) => f.id === id)
      if (index !== -1) {
        folders.value[index] = data
      } else {
        folders.value.push(data)
      }

      return data
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar pasta'
      console.error('Erro ao buscar pasta:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Cria uma nova pasta
   */
  async function createFolder(data: FolderRequest): Promise<FolderResponse> {
    isLoading.value = true
    error.value = null

    try {
      const newFolder = await apiCreateFolder(data)
      folders.value.push(newFolder)

      // Define como pasta atual
      currentFolderId.value = newFolder.id

      return newFolder
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar pasta'
      console.error('Erro ao criar pasta:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Atualiza uma pasta existente
   */
  async function updateFolder(id: number, data: FolderRequest): Promise<FolderResponse> {
    isLoading.value = true
    error.value = null

    try {
      const updatedFolder = await apiUpdateFolder(id, data)

      // Atualiza a pasta na lista
      const index = folders.value.findIndex((f) => f.id === id)
      if (index !== -1) {
        folders.value[index] = updatedFolder
      }

      return updatedFolder
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar pasta'
      console.error('Erro ao atualizar pasta:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Deleta uma pasta
   */
  async function deleteFolder(id: number): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await apiDeleteFolder(id)

      // Remove a pasta da lista
      const index = folders.value.findIndex((f) => f.id === id)
      if (index !== -1) {
        folders.value.splice(index, 1)
      }

      // Se era a pasta atual, seleciona outra
      if (currentFolderId.value === id) {
        currentFolderId.value = folders.value.length > 0 ? folders.value[0].id : null
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao deletar pasta'
      console.error('Erro ao deletar pasta:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Define a pasta atual
   */
  async function setCurrentFolder(folderId: number): Promise<void> {
    const folder = folders.value.find((f) => f.id === folderId)
    if (folder) {
      currentFolderId.value = folderId
    } else {
      try {
        // Tenta buscar a pasta na API e adiciona ao array se encontrar
        const fetched = await fetchFolderById(folderId)
        if (fetched) {
          currentFolderId.value = folderId
          return
        }
      } catch (e) {
        // Se não encontrar, exibe o aviso
        console.warn(`Pasta com ID ${folderId} não encontrada`)
      }
    }
  }

  /**
   * Incrementa a contagem de tarefas de uma pasta
   */
  function incrementTaskCount(folderId: number): void {
    const folder = folders.value.find((f) => f.id === folderId)
    if (folder) {
      folder.count++
    }
  }

  /**
   * Decrementa a contagem de tarefas de uma pasta
   */
  function decrementTaskCount(folderId: number): void {
    const folder = folders.value.find((f) => f.id === folderId)
    if (folder && folder.count > 0) {
      folder.count--
    }
  }

  /**
   * Atualiza a contagem de tarefas de uma pasta
   */
  function updateTaskCount(folderId: number, count: number): void {
    const folder = folders.value.find((f) => f.id === folderId)
    if (folder) {
      folder.count = count
    }
  }

  /**
   * Limpa o erro da store
   */
  function clearError(): void {
    error.value = null
  }

  /**
   * Reseta a store para o estado inicial
   */
  function $reset(): void {
    folders.value = []
    currentFolderId.value = null
    isLoading.value = false
    error.value = null
  }

  // ========== Return ==========

  return {
    // State
    folders,
    currentFolderId,
    isLoading,
    error,

    // Getters
    currentFolder,
    currentFolderName,
    sortedFolders,
    totalFolders,

    // Actions
    fetchFolders,
    fetchFolderById,
    createFolder,
    updateFolder,
    deleteFolder,
    setCurrentFolder,
    incrementTaskCount,
    decrementTaskCount,
    updateTaskCount,
    clearError,
    $reset,
  }
})
