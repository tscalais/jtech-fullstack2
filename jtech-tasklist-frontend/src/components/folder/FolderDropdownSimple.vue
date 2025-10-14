<script setup lang="ts">
import { ref, computed } from 'vue'
import { useClickOutside } from '@/composables/useClickOutside'
import type { Folder } from '@/types/folder'

interface Props {
  folders: Folder[]
  currentFolderId: string | number | null
  isOpen: boolean
}

interface Emits {
  (e: 'select', folderId: string): void
  (e: 'toggle'): void
  (e: 'create'): void
  (e: 'join', accessKey: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const dropdownRef = ref<HTMLElement | null>(null)
const accessKey = ref('')

useClickOutside(dropdownRef, () => {
  if (props.isOpen) emit('toggle')
})

const selectedFolder = computed(() =>
  props.folders.find(f => f.id == props.currentFolderId)
)
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <button
      class="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-primary-600 transition p-2 rounded-xl"
      @click="emit('toggle')"
    >
      <svg class="w-6 h-6 text-primary-600 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
      <span class="hidden sm:block">{{ selectedFolder?.name || 'Carregando...' }}</span>
      <svg :class="['w-4 h-4 transition-transform', isOpen && 'rotate-180']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 mt-2 w-64 md:w-72 bg-white rounded-xl shadow-2xl p-2 z-50 border border-gray-100"
    >
      <div class="space-y-1 max-h-64 overflow-y-auto">
        <div
          v-for="folder in folders"
          :key="folder.id"
          :class="[
            'flex items-center justify-between p-3 rounded-xl cursor-pointer transition',
            currentFolderId == folder.id ? 'bg-primary-500 text-white font-semibold shadow-md' : 'hover:bg-gray-100 text-gray-700'
          ]"
          @click="emit('select', folder.id)"
        >
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" :fill="currentFolderId === folder.id ? 'currentColor' : 'none'" :stroke="currentFolderId === folder.id ? 'none' : 'currentColor'" viewBox="0 0 24 24">
              <path :d="folder.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
            <span>{{ folder.name }}</span>
          </div>
          <span :class="['text-xs px-2 py-0.5 rounded-full', currentFolderId === folder.id ? 'bg-white bg-opacity-30' : 'bg-gray-200']">
            {{ folder.count }}
          </span>
        </div>
      </div>

      <div class="border-t border-gray-200 my-2"></div>

      <div class="p-2 space-y-2">
        <button
          class="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 rounded-xl hover:bg-primary-700 transition text-sm font-medium"
          @click="emit('create')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nova Pasta</span>
        </button>

        <div class="flex space-x-2">
          <input
            v-model="accessKey"
            type="text"
            placeholder="Chave de Acesso"
            class="flex-grow p-2 border border-gray-300 rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
            @keyup.enter="emit('join', accessKey)"
          />
          <button
            class="bg-gray-200 text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-300 transition text-sm font-medium disabled:opacity-50"
            @click="emit('join', accessKey)"
            :disabled="!accessKey.trim()"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
