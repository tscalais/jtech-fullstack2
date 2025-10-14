<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

// Components
import AppHeader from '@/components/layout/AppHeader.vue'
import QuickTaskForm from '@/components/task/QuickTaskForm.vue'
import TagFilter from '@/components/task/TagFilter.vue'
import TaskListGrid from '@/components/task/TaskListGrid.vue'
import TaskDetailsModal from '@/components/task/TaskDetailsModal.vue'

// Stores
import { useFoldersStore } from '@/stores/folders'
import { useTasksStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'

// Types
import type { Task, Tag } from '@/types/task'

// Router & Stores
const router = useRouter()
const foldersStore = useFoldersStore()
const tasksStore = useTasksStore()
const authStore = useAuthStore()

// Estados Locais
const isModalOpen = ref(false)
const selectedTask = ref<Task | null>(null)
const isLoading = ref(false)
const activeFilterTag = ref<string | null>(null)
const searchQuery = ref('')
const showCreateFolderModal = ref(false)

// Computed Properties
const currentFolder = computed(() =>
  foldersStore.folders.find((f) => f.id === foldersStore.currentFolderId),
)

// Ajuste do filtro por pasta atual
const filteredTasks = computed(() => {
  let tasks = tasksStore.tasks
  // Filtro por pasta atual
  tasks = tasks.filter((t) => t.folder && t.folder.id === foldersStore.currentFolderId)
  // Filtro por tag
  if (activeFilterTag.value) {
    tasks = tasks.filter((t) => Array.isArray(t.tags) && t.tags.some((tag: any) => tag.name === activeFilterTag.value))
  }
  // Filtro por busca
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        (Array.isArray(t.tags) && t.tags.some((tag: any) => tag.name && tag.name.toLowerCase().includes(query)))
    )
  }
  return tasks
})

const taskStats = computed(() => ({
  total: filteredTasks.value.length,
  completed: filteredTasks.value.filter((t) => t.completed).length,
  pending: filteredTasks.value.filter((t) => !t.completed).length,
  urgent: filteredTasks.value.filter((t) => Array.isArray(t.tags) && t.tags.some((tag: any) => tag.name === 'Urgente')).length,
}))

// Lifecycle
onMounted(async () => {
  await loadInitialData()
})

// Watchers
watch(
  () => foldersStore.currentFolderId,
  async (newFolderId) => {
    if (typeof newFolderId === 'number') {
      await loadTasksForFolder(newFolderId)
    }
  },
)

// Methods
const loadInitialData = async () => {
  isLoading.value = true
  try {
    await foldersStore.fetchFolders()
    if (typeof foldersStore.currentFolderId === 'number') {
      await loadTasksForFolder(foldersStore.currentFolderId)
    }
  } catch (error) {
    console.error('Erro ao carregar dados iniciais:', error)
  } finally {
    isLoading.value = false
  }
}

// Ajuste loadTasksForFolder para aceitar apenas number
const loadTasksForFolder = async (folderId: number) => {
  if (typeof folderId !== 'number') return
  isLoading.value = true
  try {
    await tasksStore.fetchTasks(folderId)
    activeFilterTag.value = null
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error)
  } finally {
    isLoading.value = false
  }
}

// Folder Handlers
const handleSelectFolder = async (folderId: number) => {
  foldersStore.setCurrentFolder(folderId)
}

const handleCreateFolder = () => {
  showCreateFolderModal.value = true
  // Ou navegar para rota de criação:
  // router.push('/folders/create')
}

const handleJoinFolder = async (accessKey: string) => {
  isLoading.value = true
  try {
    await foldersStore.joinFolderByKey(accessKey)
    // Mostrar notificação de sucesso
  } catch (error) {
    console.error('Erro ao entrar na pasta:', error)
    // Mostrar notificação de erro
  } finally {
    isLoading.value = false
  }
}

// Task Handlers
const handleCreateTask = async (title: string) => {
  if (!title.trim() || typeof foldersStore.currentFolderId !== 'number') return
  isLoading.value = true
  try {
    await tasksStore.createTask({
      title: title.trim(),
      folder: { id: foldersStore.currentFolderId },
      completed: false,
      subtasks: [],
      tags: [],
      favorite: false,
      description: '',
      id: 0
    })
  } catch (error) {
    console.error('Erro ao criar tarefa:', error)
  } finally {
    isLoading.value = false
  }
}

const handleShowTaskDetails = (taskId: number) => {
  const task = tasksStore.tasks.find((t) => t.id === taskId)
  if (task) {
    selectedTask.value = task
    isModalOpen.value = true
  }
}

const handleCloseModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedTask.value = null
  }, 300) // Aguarda animação de saída
}

const handleToggleComplete = async (taskId: string) => {
  try {
    await tasksStore.toggleTaskComplete(taskId)
  } catch (error) {
    console.error('Erro ao alterar status da tarefa:', error)
  }
}

const handleUpdateTask = async (updatedTask: Task) => {
  try {
    await tasksStore.updateTask(updatedTask)
    // Atualiza a tarefa selecionada se ainda estiver aberta
    if (selectedTask.value?.id === updatedTask.id) {
      selectedTask.value = updatedTask
    }
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error)
  }
}

const handleDeleteTask = async (taskId: string) => {
  try {
    await tasksStore.deleteTask(taskId)
    handleCloseModal()
    // Mostrar notificação de sucesso
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error)
    // Mostrar notificação de erro
  }
}

const handleCompleteTask = async (taskId: string) => {
  try {
    await tasksStore.toggleTaskComplete(taskId)
    handleCloseModal()
    // Mostrar notificação de sucesso
  } catch (error) {
    console.error('Erro ao completar tarefa:', error)
  }
}

// Subtask Handlers
const handleAddSubtask = async (taskId: string, text: string) => {
  try {
    await tasksStore.addSubtask(taskId, text)
  } catch (error) {
    console.error('Erro ao adicionar subtask:', error)
  }
}

const handleToggleSubtask = async (taskId: string, subtaskId: number) => {
  try {
    await tasksStore.toggleSubtask(taskId, subtaskId)
  } catch (error) {
    console.error('Erro ao toggle subtask:', error)
  }
}

const handleDeleteSubtask = async (taskId: string, subtaskId: number) => {
  try {
    await tasksStore.deleteSubtask(taskId, subtaskId)
  } catch (error) {
    console.error('Erro ao deletar subtask:', error)
  }
}

// Tag Handlers
const handleAddTag = async (taskId: string, tag: Tag) => {
  try {
    await tasksStore.addTag(taskId, tag)
  } catch (error) {
    console.error('Erro ao adicionar tag:', error)
  }
}

const handleRemoveTag = async (taskId: string, tagName: string) => {
  try {
    await tasksStore.removeTag(taskId, tagName)
  } catch (error) {
    console.error('Erro ao remover tag:', error)
  }
}

const handleFilterByTag = (tagName: string) => {
  activeFilterTag.value = activeFilterTag.value === tagName ? null : tagName
}

// User Handlers
const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}

const handleShowNotifications = () => {
  // Implementar modal/drawer de notificações
  console.log('Mostrar notificações')
}

const handleShowProfile = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="h-screen overflow-hidden flex flex-col ">
    <!-- Header -->
    <AppHeader
      :folders="foldersStore.folders"
      :current-folder-id="foldersStore.currentFolderId !== null ? String(foldersStore.currentFolderId) : ''"
      :user-name="authStore.user?.userName"
      :full-name="authStore.user?.fullName"
      :user-initials="authStore.user ? authStore.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : ''"
      :notification-count="0"
      @select-folder="handleSelectFolder"
      @create-folder="handleCreateFolder"
      @join-folder="handleJoinFolder"
      @logout="handleLogout"
      @show-notifications="handleShowNotifications"
      @show-profile="handleShowProfile"
    />

    <!-- Main Content Area -->
    <div class="flex flex-1 overflow-hidden relative">
      <!-- Task Panel (Content) -->
      <main
        id="task-panel"
        class="flex-1 min-w-0  p-4 md:p-6 flex flex-col overflow-hidden z-10"
      >
        <!-- Header da Pasta Atual com Stats -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
                {{ currentFolder?.name || 'Carregando...' }}
              </h1>
              <p class="text-sm text-gray-500 mt-1">
                {{ taskStats.total }} tarefa{{ taskStats.total !== 1 ? 's' : '' }} ·
                {{ taskStats.completed }} concluída{{ taskStats.completed !== 1 ? 's' : '' }}
                <span v-if="taskStats.urgent > 0" class="text-yellow-600 font-medium">
                  · {{ taskStats.urgent }} urgente{{ taskStats.urgent !== 1 ? 's' : '' }}
                </span>
              </p>
            </div>

            <!-- Botão de Ordenação (Opcional) -->
            <div class="hidden md:flex items-center space-x-2">
              <button
                class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-primary-600 border border-gray-300 rounded-lg hover:border-primary-500 transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
                <span>Ordenar</span>
              </button>
            </div>
          </div>

        </div>

        <!-- Quick Task Form -->
        <QuickTaskForm @create-task="handleCreateTask" />

        <!-- Tag Filter -->
        <TagFilter :active-tag="activeFilterTag" @select-tag="handleFilterByTag" />

        <!-- Loading State -->
        <div v-if="isLoading" class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"
            ></div>
            <p class="text-gray-500">Carregando tarefas...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredTasks.length === 0" class="flex-1 flex items-center justify-center">
          <div class="text-center max-w-md">
            <svg
              class="w-24 h-24 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">
              {{ activeFilterTag ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa ainda' }}
            </h3>
            <p class="text-gray-500 mb-6">
              {{
                activeFilterTag
                  ? `Nenhuma tarefa com a tag "${activeFilterTag}"`
                  : 'Comece criando sua primeira tarefa acima!'
              }}
            </p>
            <button
              v-if="activeFilterTag"
              class="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition font-medium shadow-md"
              @click="activeFilterTag = null"
            >
              Limpar Filtro
            </button>
          </div>
        </div>

        <!-- Task List Grid -->
        <TaskListGrid
          v-else
          :tasks="filteredTasks"
          @show-details="handleShowTaskDetails"
          @toggle-complete="handleToggleComplete"
        />
      </main>
    </div>

    <!-- Task Details Modal -->
    <TaskDetailsModal
      :task="selectedTask"
      :is-open="isModalOpen"
      :folder-name="currentFolder?.name"
      @close="handleCloseModal"
      @update="handleUpdateTask"
      @delete="handleDeleteTask"
      @complete="handleCompleteTask"
      @add-subtask="handleAddSubtask"
      @toggle-subtask="handleToggleSubtask"
      @delete-subtask="handleDeleteSubtask"
      @add-tag="handleAddTag"
      @remove-tag="handleRemoveTag"
    />
  </div>
</template>

<style scoped>
/* Animação de fade para transições */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animação do spinner de loading */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Scrollbar customizada */
#task-panel::-webkit-scrollbar {
  width: 8px;
}

#task-panel::-webkit-scrollbar-track {
  background: #f1f5f9;
}

#task-panel::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

#task-panel::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
