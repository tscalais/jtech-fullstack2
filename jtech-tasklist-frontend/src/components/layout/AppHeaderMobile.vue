<script setup lang="ts">
import { ref } from 'vue'
import FolderDropdown from '@/components/folder/FolderDropdown.vue'
import type { FolderResponse } from '@/types/folder'

defineProps<{
  folders: FolderResponse[]
  currentFolderId: string
  userInitials?: string
}>()

const emit = defineEmits<{
  'select-folder': [folderId: string]
  'create-folder': []
  'join-folder': [accessKey: string]
  'open-menu': []
}>()

const isDropdownOpen = ref(false)
</script>

<template>
  <header class="bg-white border-b border-gray-200 shadow-sm p-4 flex items-center justify-between sticky top-0 z-20">

    <!-- Logo + Dropdown -->
    <div class="flex items-center space-x-3">
      <svg class="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>

      <FolderDropdown
        :folders="folders"
        :current-folder-id="currentFolderId"
        :is-open="isDropdownOpen"
        @select="emit('select-folder', $event)"
        @toggle="isDropdownOpen = !isDropdownOpen"
        @create="emit('create-folder')"
        @join="emit('join-folder', $event)"
      />
    </div>

    <!-- Avatar -->
    <button
      class="w-9 h-9 rounded-full bg-primary-200 flex items-center justify-center text-primary-600 font-medium text-sm"
      @click="emit('open-menu')"
    >
      {{ userInitials || 'US' }}
    </button>
  </header>
</template>
