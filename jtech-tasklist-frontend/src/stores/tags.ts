import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listTags, createTag, updateTag, deleteTag, associateTagToTask, dissociateTagFromTask } from '@/lib/api'
import type { TagEntity } from '@/types'

export const useTagsStore = defineStore('tags', () => {
  const tags = ref<TagEntity[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTags(folderId: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const data = await listTags(folderId)
      tags.value = data
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Erro ao buscar tags'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function addTag(folderId: number, tag: Record<string, string>): Promise<TagEntity> {
    isLoading.value = true
    error.value = null
    try {
      const data = await createTag(folderId, tag)
      tags.value.push(data)
      return data
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Erro ao criar tag'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function editTag(folderId: number, tagId: number, tag: Record<string, string>): Promise<TagEntity> {
    isLoading.value = true
    error.value = null
    try {
      const data = await updateTag(folderId, tagId, tag)
      const idx = tags.value.findIndex(t => t.id === tagId)
      if (idx !== -1) tags.value[idx] = data
      return data
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Erro ao atualizar tag'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function removeTag(folderId: number, tagId: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      await deleteTag(folderId, tagId)
      tags.value = tags.value.filter(t => t.id !== tagId)
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Erro ao remover tag'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function associateTag(taskId: number, tagId: number): Promise<void> {
    await associateTagToTask(taskId, tagId)
  }

  async function dissociateTag(taskId: number, tagId: number): Promise<void> {
    await dissociateTagFromTask(taskId, tagId)
  }

  return { tags, isLoading, error, fetchTags, addTag, editTag, removeTag, associateTag, dissociateTag }
})
