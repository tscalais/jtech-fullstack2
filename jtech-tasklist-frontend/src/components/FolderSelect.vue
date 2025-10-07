<template>
  <div class="relative w-full max-w-xs">
    <div class="flex items-center space-x-2">
      <span class="text-yellow-600">
        <!-- Folder Icon SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7a2 2 0 012-2h3.172a2 2 0 011.414.586l1.828 1.828A2 2 0 0012.828 8H19a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>
      </span>
      <select
        v-model="selectedId"
        @change="onSelectFolder(Number(selectedId))"
        :disabled="loading || folders.length === 0"
        class="block w-full px-3 py-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        <option v-if="loading" disabled>Carregando pastas...</option>
        <option v-else-if="folders.length === 0" disabled>Nenhuma pasta</option>
        <option v-else value="" disabled>Selecione uma pasta</option>
        <option v-for="folder in folders" :key="folder.id" :value="folder.id">
          {{ folder.name }}
        </option>
      </select>
      <button
        @click="openCreateFolderDialog"
        class="flex items-center px-2 py-1 ml-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        :disabled="loading"
        title="Nova Pasta"
      >
        <!-- Plus Folder Icon SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m3-3H9m-4 6a2 2 0 01-2-2V7a2 2 0 012-2h3.172a2 2 0 011.414.586l1.828 1.828A2 2 0 0012.828 8H19a2 2 0 012 2v7a2 2 0 01-2 2H5z" /></svg>
        Nova Pasta
      </button>
    </div>
    <!-- Modal -->
    <div v-if="createFolderDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-sm p-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-lg font-semibold">Criar Nova Pasta</h2>
          <button @click="createFolderDialog = false" class="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
        </div>
        <FolderForm @submit="onCreateFolder" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useFoldersStore } from '@/stores/folders'
import FolderForm from '@/components/FolderForm.vue'

const foldersStore = useFoldersStore()
const { folders, activeFolderId, loading } = storeToRefs(foldersStore)
const createFolderDialog = ref(false)

// Local ref for select binding (to avoid v-model warning with store refs)
const selectedId = ref<number | ''>(activeFolderId.value ?? '')

watch(activeFolderId, (val) => {
  selectedId.value = val ?? ''
})

function openCreateFolderDialog() {
  createFolderDialog.value = true
}

async function onCreateFolder(data: { name: string }) {
  try {
    await foldersStore.createFolder(data)
    createFolderDialog.value = false
  } catch {
    // erro tratado no store
  }
}

function onSelectFolder(id: number) {
  foldersStore.setActiveFolderId(id)
}
</script>

<style scoped>
/* No custom styles, all handled by Tailwind */
</style>
