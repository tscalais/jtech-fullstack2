<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
      <FolderOpenIcon v-if="activeFolderName" class="w-7 h-7 text-yellow-500" />
      {{ activeFolderName || 'Tarefas' }}
    </h2>
    <TaskList v-if="activeFolderId" :folder-id="activeFolderId" />
  </div>
</template>

<script lang="ts" setup>
import TaskList from '@/components/TaskList.vue'
import { useFoldersStore } from '@/stores/folders'
import { computed } from 'vue'
import { FolderOpenIcon } from '@heroicons/vue/24/outline'

const foldersStore = useFoldersStore()
const activeFolderId = foldersStore.activeFolderId
const activeFolderName = computed(() => {
  const folder = foldersStore.folders.find(f => f.id === activeFolderId)
  return folder ? folder.name : ''
})
</script>

<style scoped>
</style>
