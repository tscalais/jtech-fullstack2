<script setup lang="ts">
import { ref, computed } from 'vue'
import { useClickOutside } from '@/composables/useClickOutside'
import type { FolderEntity } from '@/types/folder'

const props = defineProps<{
  folders: FolderEntity[]
  currentFolderId: string | number | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  'select': [folderId: string]
  'toggle': []
  'create': []
  'join': [accessKey: string]
}>()

const dropdownRef = ref<HTMLElement | null>(null)
const accessKey = ref('')

// Fecha o dropdown ao clicar fora
useClickOutside(dropdownRef, () => {
  if (props.isOpen) {
    emit('toggle')
  }
})

// Pasta selecionada atual
const selectedFolder = computed(() =>
  props.folders.find(f => f.id == props.currentFolderId)
)

// Handler para seleção de pasta
const handleSelectFolder = (folderId: string | number) => {
  emit('select', folderId)
}

// Handler para criar nova pasta
const handleCreateFolder = () => {
  emit('create')
  // Aqui você pode abrir um modal ou navegar para criação
}

// Handler para entrar em pasta com chave
const handleJoinFolder = () => {
  if (accessKey.value.trim()) {
    emit('join', accessKey.value.trim())
    accessKey.value = ''
  }
}
</script>

<template>
  <div
    ref="dropdownRef"
    id="folder-dropdown-container"
    class="relative"
  >
    <!-- Botão do Dropdown -->
    <button
      id="folder-menu-button"
      class="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-primary-600 transition duration-150 p-2 rounded-xl"
      @click="emit('toggle')"
    >
      <!-- Ícone Pasta (Mobile) -->
      <svg
        class="w-6 h-6 text-primary-600 sm:hidden"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>

      <!-- Nome da Pasta Selecionada (Desktop) -->
      <span
        id="selected-folder-display"
        class="hidden sm:block"
      >
        {{ selectedFolder?.name || 'Carregando...' }}
      </span>

      <!-- Ícone Seta -->
      <svg
        :class="[
          'w-4 h-4 transition-transform duration-200',
          isOpen && 'rotate-180'
        ]"
        id="folder-arrow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Conteúdo do Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-show="isOpen"
        id="folder-dropdown-content"
        class="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 mt-2 w-64 md:w-72 bg-white rounded-xl shadow-2xl p-2 z-50 border border-gray-100"
      >
        <!-- Lista de Pastas -->
        <div class="space-y-1 max-h-64 overflow-y-auto">
          <div
            v-for="folder in folders"
            :key="folder.id"
            :id="folder.id"
            :data-name="folder.name"
            :class="[
              'folder-item flex items-center justify-between p-3 rounded-xl cursor-pointer transition duration-150',
              currentFolderId === folder.id
                ? 'bg-primary-500 text-white font-semibold shadow-md'
                : 'hover:bg-gray-100 text-gray-700'
            ]"
            @click="handleSelectFolder(folder.id)"
          >
            <div class="flex items-center space-x-2">
              <!-- Ícone da Pasta -->
              <svg
                class="w-5 h-5 text-gray-900 dark:text-white"
                :fill="currentFolderId === folder.id ? 'currentColor' : 'none'"
                :stroke="currentFolderId === folder.id ? 'none' : 'currentColor'"
                viewBox="0 0 24 24"
              >
                <path
                  :d="folder.icon"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  :stroke-linecap="currentFolderId !== folder.id ? 'round' : undefined"
                  :stroke-linejoin="currentFolderId !== folder.id ? 'round' : undefined"
                  :stroke-width="currentFolderId !== folder.id ? '2' : undefined"
                />
              </svg>
              <span>{{ folder.name }}</span>
            </div>

            <!-- Badge de Contagem -->
            <span
              :class="[
                'text-xs px-2 py-0.5 rounded-full',
                currentFolderId === folder.id
                  ? 'bg-white bg-opacity-30'
                  : 'bg-gray-200'
              ]"
            >
              {{ folder.count }}
            </span>
          </div>
        </div>

        <!-- Separador -->
        <div class="border-t border-gray-200 my-2"></div>

        <!-- Ações da Pasta -->
        <div class="p-2 space-y-2">
          <!-- Botão Nova Pasta -->
          <button
            class="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 rounded-xl hover:bg-primary-700 transition duration-150 shadow-md text-sm font-medium"
            @click="handleCreateFolder"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Nova Pasta</span>
          </button>

          <!-- Input para Chave de Acesso -->
          <div class="flex space-x-2">
            <input
              v-model="accessKey"
              type="text"
              placeholder="Chave de Acesso"
              class="flex-grow p-2 border border-gray-300 rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
              @keyup.enter="handleJoinFolder"
            />
            <button
              class="bg-gray-200 text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-300 transition duration-150 text-sm font-medium"
              @click="handleJoinFolder"
              :disabled="!accessKey.trim()"
              :class="{ 'opacity-50 cursor-not-allowed': !accessKey.trim() }"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Scrollbar customizada para a lista de pastas */
.space-y-1::-webkit-scrollbar {
  width: 6px;
}

.space-y-1::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.space-y-1::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.space-y-1::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
