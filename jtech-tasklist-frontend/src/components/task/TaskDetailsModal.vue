<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Task } from '@/types/task'
import { useSubtasksStore } from '@/stores/subtasks'
import { useTagsStore } from '@/stores/tags'

const props = defineProps<{
  task: Task | null
  isOpen: boolean
  folderName?: string
}>()

const emit = defineEmits<{
  'close': []
  'update': [task: Task]
  'delete': [taskId: string]
  'complete': [taskId: string]
}>()

const newSubtaskText = ref('')
const isEditingTitle = ref(false)
const editedTitle = ref('')
const showDeleteConfirm = ref(false)

// Integração com stores
const subtasksStore = useSubtasksStore()
const tagsStore = useTagsStore()

watch(() => props.task, async (task) => {
  if (task && props.isOpen) {
    await subtasksStore.fetchSubtasks(task.folder.id, task.id)
    await tagsStore.fetchTags(task.folder.id)
  }
}, { immediate: true })

const subtasks = computed(() => subtasksStore.subtasks)
const tags = computed(() => tagsStore.tags)

const isTaskCompleted = computed(() => !!props.task?.completed)

const completedSubtasks = computed(() =>
  subtasks.value.filter((s: Subtask) => s.completed).length
)
const totalSubtasks = computed(() => subtasks.value.length)
const progressPercentage = computed(() => {
  if (!totalSubtasks.value) return 0
  return Math.round((completedSubtasks.value / totalSubtasks.value) * 100)
})

async function handleAddSubtask() {
  if (!props.task || !newSubtaskText.value.trim()) return
  await subtasksStore.addSubtask(props.task.folder.id, props.task.id, { description: newSubtaskText.value })
  newSubtaskText.value = ''
}

async function handleToggleSubtask(subtaskId: number) {
  // Aqui você pode implementar a lógica de toggle na API, se necessário
}
async function handleDeleteSubtask(subtaskId: number) {
  // Aqui você pode implementar a lógica de deleção na API, se necessário
}

async function handleAddTag(tagId: number) {
  if (!props.task) return
  await tagsStore.associateTag(props.task.id, tagId)
}

async function handleRemoveTag(tagId: number) {
  if (!props.task) return
  await tagsStore.dissociateTag(props.task.id, tagId)
}

// Watchers
watch(() => props.task, (newTask) => {
  if (newTask) {
    editedTitle.value = newTask.title
    // Aqui você carregaria as subtasks da API
  }
})

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})

// Métodos
const resetForm = () => {
  newSubtaskText.value = ''
  isEditingTitle.value = false
  showDeleteConfirm.value = false
}

const handleClose = () => {
  emit('close')
}

const handleSaveTitle = () => {
  if (props.task && editedTitle.value.trim()) {
    const updatedTask = { ...props.task, title: editedTitle.value.trim() }
    emit('update', updatedTask)
    isEditingTitle.value = false
  }
}

const handleDelete = () => {
  if (props.task) {
    emit('delete', props.task.id)
    handleClose()
  }
}
const handleComplete = () => {
  if (props.task) {
    emit('complete', props.task.id)
    handleClose()
  }
}

// Previne o scroll do body quando o modal está aberto
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen && task"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-4 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-4 scale-95"
        >
          <div
            v-if="isOpen && task"
            class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            @click.stop
          >

            <!-- Header do Modal -->
            <div class="flex-shrink-0 flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div class="flex items-center space-x-3">
                <h2 class="text-xl font-bold text-gray-900">Detalhes da Tarefa</h2>

                <!-- Badge de Status -->
                <span
                  v-if="isTaskCompleted"
                  class="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-600"
                >
                  Concluída
                </span>
              </div>

              <button
                class="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition duration-150"
                aria-label="Fechar Detalhes"
                @click="handleClose"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Conteúdo Scrollável -->
            <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">

              <!-- Título e Pasta -->
              <div class="space-y-3">
                <!-- Título Editável -->
                <div v-if="!isEditingTitle">
                  <h3
                    class="text-3xl font-extrabold text-gray-800 cursor-pointer hover:text-primary-600 transition"
                    :class="{ 'line-through text-gray-500': isTaskCompleted }"
                    @click="isEditingTitle = true"
                  >
                    {{ task.title }}
                  </h3>
                </div>
                <div v-else class="flex space-x-2">
                  <input
                    v-model="editedTitle"
                    type="text"
                    class="flex-1 text-2xl font-bold border-2 border-primary-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    @keyup.enter="handleSaveTitle"
                    @keyup.esc="isEditingTitle = false"
                    autofocus
                  />
                  <button
                    class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                    @click="handleSaveTitle"
                  >
                    Salvar
                  </button>
                  <button
                    class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                    @click="isEditingTitle = false"
                  >
                    Cancelar
                  </button>
                </div>

                <!-- Informação da Pasta -->
                <p class="text-sm text-gray-500 flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span>{{ folderName || 'Pasta Desconhecida' }}</span>
                </p>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2 pt-2">
                  <span
                    v-for="tag in task.tags"
                    :key="tag.name"
                    :class="[
                      'group relative text-sm font-semibold px-3 py-1 rounded-full flex items-center space-x-2',
                      `bg-${tag.color}-100 text-${tag.color}-600`
                    ]"
                  >
                    <span>#{{ tag.name }}</span>
                    <button
                      class="opacity-0 group-hover:opacity-100 transition-opacity"
                      @click="handleRemoveTag(tag.name)"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </span>

                  <!-- Botão Adicionar Tag -->
                  <button
                    class="text-sm font-semibold px-3 py-1 rounded-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-primary-500 hover:text-primary-600 transition"
                  >
                    + Tag
                  </button>
                </div>
              </div>

              <!-- Progresso -->
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700">Progresso</span>
                  <span class="text-sm font-bold text-primary-600">{{ progressPercentage }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    class="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
                    :style="{ width: `${progressPercentage}%` }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  {{ completedSubtasks }} de 5 microtarefas concluídas
                </p>
              </div>

              <!-- Microtarefas -->
              <div>
                <h4 class="text-xl font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span>Microtarefas ({{ completedSubtasks }}/5)</span>
                </h4>

                <!-- Input para Nova Subtask -->
                <div class="flex space-x-2 mb-4">
                  <input
                    v-model="newSubtaskText"
                    type="text"
                    placeholder="Adicionar nova microtarefa..."
                    class="flex-grow p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                    @keyup.enter="handleAddSubtask"
                  />
                  <button
                    class="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition duration-150 text-sm font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="!newSubtaskText.trim()"
                    @click="handleAddSubtask"
                  >
                    Adicionar
                  </button>
                </div>

                <!-- Lista de Subtasks -->
                <div class="space-y-2 max-h-64 overflow-y-auto">
                  <TransitionGroup
                    enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 translate-x-2"
                    enter-to-class="opacity-100 translate-x-0"
                    leave-active-class="transition ease-in duration-150"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <div
                      v-for="subtask in subtasks"
                      :key="subtask.id"
                      class="group flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition"
                    >
                      <input
                        type="checkbox"
                        :checked="subtask.completed"
                        :class="[
                          'form-checkbox h-5 w-5 rounded border-gray-300 transition duration-150 cursor-pointer',
                          subtask.completed ? 'text-green-500 focus:ring-green-500' : 'text-primary-500 focus:ring-primary-500'
                        ]"
                        @change="handleToggleSubtask(subtask.id)"
                      />

                      <span
                        :class="[
                          'flex-1 text-base text-gray-700 transition',
                          subtask.completed && 'line-through text-gray-400'
                        ]"
                      >
                        {{ subtask.title }}
                      </span>

                      <button
                        class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-1"
                        @click="handleDeleteSubtask(subtask.id)"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </TransitionGroup>

                  <div v-if="subtasks.length === 0" class="text-center py-8 text-gray-400">
                    <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p class="text-sm">Nenhuma microtarefa ainda</p>
                  </div>
                </div>
              </div>

              <!-- Membros -->
              <div>
                <h4 class="text-xl font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Membros da Pasta</span>
                </h4>

                <p class="text-sm text-gray-500 mb-3">
                  Todos os membros podem visualizar e manipular as tarefas.
                </p>

                <div class="flex items-center space-x-2 flex-wrap gap-2">
                  <div
                    v-for="member in members"
                    :key="member.id"
                    :class="[
                      'relative w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm',
                      `bg-${member.color}-200 text-${member.color}-600`,
                      member.isOwner && 'ring-2 ring-primary-500'
                    ]"
                    :title="`${member.name}${member.isOwner ? ' (Owner)' : ''}`"
                  >
                    {{ member.initials }}
                    <span
                      v-if="member.isOwner"
                      class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
                      title="Proprietário"
                    >
                      <svg class="w-3 h-3 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                  </div>

                  <button
                    class="w-10 h-10 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:border-primary-500 transition duration-150"
                    title="Gerenciar Membros"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Seção de Timestamps (Data de Criação/Atualização) -->
              <div class="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Criada em: 15/01/2024 às 14:30</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Última atualização: 20/01/2024 às 10:15</span>
                </div>
              </div>

            </div>

            <!-- Footer Fixo (Ações) -->
            <div class="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">

              <!-- Botões de Ação Esquerda -->
              <div class="flex space-x-2 w-full sm:w-auto">
                <button
                  v-if="!showDeleteConfirm"
                  class="flex-1 sm:flex-none flex items-center justify-center space-x-2 text-red-600 hover:text-white hover:bg-red-500 border border-red-300 px-4 py-2 rounded-xl transition duration-150 font-medium"
                  @click="showDeleteConfirm = true"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Excluir</span>
                </button>

                <!-- Confirmação de Exclusão -->
                <div v-else class="flex space-x-2 w-full sm:w-auto">
                  <button
                    class="flex-1 sm:flex-none bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition duration-150 font-medium"
                    @click="handleDelete"
                  >
                    Confirmar
                  </button>
                  <button
                    class="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition duration-150 font-medium"
                    @click="showDeleteConfirm = false"
                  >
                    Cancelar
                  </button>
                </div>
              </div>

              <!-- Botões de Ação Direita -->
              <div class="flex space-x-2 w-full sm:w-auto">
                <button
                  class="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition duration-150 font-medium"
                  @click="handleClose"
                >
                  <span>Fechar</span>
                </button>

                <button
                  v-if="!isTaskCompleted"
                  class="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition duration-150 font-medium shadow-md"
                  @click="handleComplete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Concluir</span>
                </button>

                <button
                  v-else
                  class="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600 transition duration-150 font-medium shadow-md"
                  @click="handleComplete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Reabrir</span>
                </button>
              </div>

            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Customização do scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Animação para o progresso */
@keyframes slideIn {
  from {
    width: 0;
  }
}

.bg-gradient-to-r {
  animation: slideIn 1s ease-out;
}

/* Garantir que o modal cubra tudo */
.fixed.inset-0 {
  z-index: 9999;
}
</style>
