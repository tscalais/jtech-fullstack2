<script setup lang="ts">
import { ref, computed } from 'vue'
import FolderDropdown from '@/components/folder/FolderDropdown.vue'
import type { FolderResponse } from '@/types/folder'
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  ClipboardDocumentCheckIcon as ClipboardIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  folders: FolderResponse[]
  currentFolderId: string
  fullName: string
  userName?: string
  userInitials?: string
  notificationCount?: number
}>()

const emit = defineEmits<{
  'select-folder': [folderId: number]
  'create-folder': []
  'join-folder': [accessKey: string]
  logout: []
  'show-notifications': []
  'show-profile': []
}>()

// Estados locais
const isDropdownOpen = ref(false)
const isProfileMenuOpen = ref(false)
const searchQuery = ref('')

// Computed
const fullName = computed(() => props.fullName || 'Usuário')
const userName = computed(() => props.userName || 'user')
const displayInitials = computed(() => props.userInitials || 'US')
const hasNotifications = computed(() => (props.notificationCount ?? 0) > 0)

// Handlers
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    isProfileMenuOpen.value = false
  }
}

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
  if (isProfileMenuOpen.value) {
    isDropdownOpen.value = false
  }
}

const handleSearch = () => {
  console.log('Buscar:', searchQuery.value)
  // Implementar lógica de busca
}

const handleSelectFolder = (folderId: string) => {
  emit('select-folder', folderId)
  isDropdownOpen.value = false
}
</script>

<template>
  <header
    class="bg-white dark:bg-gray-900 border-b shadow-sm p-4 flex items-center justify-between lg:justify-start lg:gap-6 z-20 sticky top-0"
  >
    <!-- Seção Esquerda: Logo + Dropdown de Pastas -->
    <div class="flex items-center space-x-4">
      <!-- Logo/Ícone da Aplicação -->
      <div class="flex items-center space-x-2">
        <svg
          class="w-8 h-8 text-gray-900 dark:text-white flex-shrink-0"
          width="800px"
          height="800px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.5 2C8.67157 2 8 2.67157 8 3.5V4.5C8 5.32843 8.67157 6 9.5 6H14.5C15.3284 6 16 5.32843 16 4.5V3.5C16 2.67157 15.3284 2 14.5 2H9.5Z"
            fill="currentColor"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.5 4.03662C5.24209 4.10719 4.44798 4.30764 3.87868 4.87694C3 5.75562 3 7.16983 3 9.99826V15.9983C3 18.8267 3 20.2409 3.87868 21.1196C4.75736 21.9983 6.17157 21.9983 9 21.9983H15C17.8284 21.9983 19.2426 21.9983 20.1213 21.1196C21 20.2409 21 18.8267 21 15.9983V9.99826C21 7.16983 21 5.75562 20.1213 4.87694C19.552 4.30764 18.7579 4.10719 17.5 4.03662V4.5C17.5 6.15685 16.1569 7.5 14.5 7.5H9.5C7.84315 7.5 6.5 6.15685 6.5 4.5V4.03662ZM15.5117 12.5483C15.8146 12.2657 15.8309 11.7911 15.5483 11.4883C15.2657 11.1855 14.7911 11.1691 14.4883 11.4517L10.7143 14.9741L9.51174 13.8517C9.20893 13.5691 8.73434 13.5855 8.45171 13.8883C8.16909 14.1911 8.18545 14.6657 8.48826 14.9483L10.2025 16.5483C10.4907 16.8172 10.9379 16.8172 11.226 16.5483L15.5117 12.5483Z"
            fill="currentColor"
          />
        </svg>

        <span class="hidden md:block text-xl font-bold text-gray-900 dark:text-white"
          >TaskList</span
        >
      </div>

      <!-- Dropdown de Pastas -->
      <FolderDropdown
        :folders="folders"
        :current-folder-id="currentFolderId"
        :is-open="isDropdownOpen"
        @select="handleSelectFolder"
        @toggle="toggleDropdown"
        @create="emit('create-folder')"
        @join="emit('join-folder', $event)"
      />
    </div>

    <!-- Seção Centro: Barra de Pesquisa -->
    <div class="hidden md:flex flex-grow max-w-lg mx-4">
      <div class="relative w-full">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Buscar tarefas ou tags..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 shadow-sm"
          @keyup.enter="handleSearch"
        />
      </div>
    </div>

    <!-- Seção Direita: Notificações + Perfil -->
    <div class="flex items-center space-x-3">
      <!-- Botão de Busca Mobile -->
      <button
        class="md:hidden text-gray-500 hover:text-primary-600 p-2 rounded-full transition duration-150"
        aria-label="Buscar"
      >
        <MagnifyingGlassIcon class="w-6 h-6" aria-hidden="true" />
      </button>

      <!-- Notificações -->
      <button
        class="relative text-gray-500 hover:text-primary-600 p-2 rounded-full transition duration-150 hidden lg:block"
        aria-label="Notificações"
        @click="emit('show-notifications')"
      >
        <BellIcon class="w-6 h-6" aria-hidden="true" />

        <!-- Badge de Notificação -->
        <span
          v-if="hasNotifications"
          class="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
        ></span>
      </button>

      <!-- Menu de Perfil -->
      <div class="relative">
        <button
          class="flex items-center space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition duration-150"
          @click="toggleProfileMenu"
        >
          <!-- Avatar -->
          <div
            class="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-600 font-medium text-sm"
          >
            {{ displayInitials }}
          </div>

          <!-- Nome do Usuário (Desktop) -->
          <span class="hidden lg:block text-sm font-medium text-gray-700">
            {{ fullName }}
          </span>

          <!-- Seta do Dropdown -->
          <ChevronDownIcon
            :class="[
              'w-4 h-4 text-gray-400 transition-transform duration-200 hidden lg:block',
              isProfileMenuOpen && 'rotate-180',
            ]"
            aria-hidden="true"
          />
        </button>

        <!-- Dropdown do Perfil -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div
            v-show="isProfileMenuOpen"
            class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100"
          >
            <!-- Info do Usuário -->
            <div class="px-4 py-3 border-b border-gray-200">
              <p class="text-sm font-medium text-gray-900">{{ fullName }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ userName }}</p>
            </div>

            <!-- Menu Items -->
            <div class="py-1">
              <button
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 flex items-center space-x-2"
                @click="emit('show-profile')"
              >
                <UserCircleIcon class="w-4 h-4" aria-hidden="true" />
                <span>Meu Perfil</span>
              </button>

              <button
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 flex items-center space-x-2"
              >
                <Cog6ToothIcon class="w-4 h-4" aria-hidden="true" />
                <span>Configurações</span>
              </button>

              <button
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 flex items-center space-x-2 lg:hidden"
                @click="emit('show-notifications')"
              >
                <BellIcon class="w-4 h-4" aria-hidden="true" />
                <span>Notificações</span>
                <span
                  v-if="hasNotifications"
                  class="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full"
                >
                  {{ notificationCount }}
                </span>
              </button>
            </div>

            <!-- Logout -->
            <div class="border-t border-gray-200 py-1">
              <button
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-150 flex items-center space-x-2"
                @click="emit('logout')"
              >
                <ArrowRightStartOnRectangleIcon class="w-4 h-4" aria-hidden="true" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Garantir que o header fique fixo no topo */
header {
  backdrop-filter: blur(10px);
}

/* Estilo para o input de busca */
input[type='search']::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}
</style>
