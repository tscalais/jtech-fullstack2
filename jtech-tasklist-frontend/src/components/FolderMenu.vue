<template>
  <Popover class="relative">
    <PopoverButton
      class="flex items-center gap-x-2 px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none"
    >
      <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 7v10a2 2 0 0 1 2 2h14a2 2 0 0 1 2-2V7M3 7l9-4 9 4"
        />
      </svg>
      <span>{{ foldersStore.activeFolder?.name || 'Pastas' }}</span>
    </PopoverButton>
    <PopoverPanel
      class="absolute z-10 mt-3 left-1/2 -translate-x-1/2 w-[95vw] max-w-sm sm:left-0 sm:translate-x-0 sm:w-80 sm:max-w-md rounded-3xl bg-white shadow-lg outline-1 outline-gray-900/5 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 px-2 sm:px-0 h-[80vh] max-h-[80vh] overflow-x-hidden"
    >
      <div class="flex flex-col h-full min-h-0 w-full overflow-x-hidden">
        <div class="flex-1 min-h-0 overflow-y-auto w-full overflow-x-hidden">
          <FolderList
            :folders="foldersStore.folders"
            :activeFolderId="foldersStore.activeFolderId"
            :containerComponent="'div'"
            :showActions="false"
            @select="selectFolder"
          />
        </div>
        <div class="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50 dark:divide-white/10 dark:bg-gray-700/50 rounded-b-3xl">
          <button @click="openCreateDialog" class="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700/50 w-full rounded-bl-3xl">
            <svg class="size-5 flex-none text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
            Adicionar pasta
          </button>
          <div></div>
        </div>
      </div>
    </PopoverPanel>
  </Popover>

  <!-- Modal para criar pasta -->
  <div
    v-if="showCreateFolderDialog"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm relative">
      <button
        @click="showCreateFolderDialog = false"
        class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <FolderForm @submit="onCreateFolder" @cancel="showCreateFolderDialog = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFoldersStore } from '@/stores/folders'
import FolderForm from '@/components/FolderForm.vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import FolderList from './FolderList.vue'

const foldersStore = useFoldersStore()
const showCreateFolderDialog = ref(false)

function openCreateDialog() {
  showCreateFolderDialog.value = true
}
function selectFolder(id) {
  foldersStore.setActiveFolderId(id)
}
async function onCreateFolder(data) {
  await foldersStore.createFolder(data)
  showCreateFolderDialog.value = false
}
</script>
