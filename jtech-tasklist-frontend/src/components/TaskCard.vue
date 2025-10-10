<template>
  <div
    class="mx-auto flex flex-col justify-between rounded-xl bg-white p-0 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 min-h-[120px] max-w-md w-full"
    :style="editingTitle ? { maxWidth: '100vw', width: 'auto', minWidth: (localTitle.length + 8) + 'ch' } : { maxWidth: '32rem', width: '100%', minWidth: '0' }"
  >
    <div class="flex items-start gap-2 p-6 pb-3">
      <!-- Favorite icon -->
      <button @click.stop="onToggleFavorite" class="mt-1 mr-2 focus:outline-none flex-shrink-0" :title="isFavorite ? 'Remover dos favoritos' : 'Favoritar'">
        <svg v-if="isFavorite" class="w-5 h-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="w-5 h-5 text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
      </button>
      <div class="flex flex-col min-w-0 w-full">
        <span class="text-lg font-semibold text-black dark:text-white break-words leading-snug">
          {{ localTitle }}
        </span>
      </div>
    </div>

    <!-- Subtasks or details -->
    <div class="px-6 pb-4">
      <ul class="text-sm text-gray-500 dark:text-gray-400 space-y-0.5">
        <li v-for="(sub, idx) in task.subtasks || []" :key="idx">{{ sub.title || sub }}</li>
        <li v-if="!(task.subtasks && task.subtasks.length)">Sem subtarefas</li>
      </ul>
    </div>

    <!-- Action buttons -->
    <div class="grid grid-cols-2 divide-x divide-gray-900/5 border-t border-gray-200 dark:divide-white/10 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
      <button
        @click="deleteTask(task)"
        class="flex items-center justify-center gap-x-2.5 p-4 text-base font-semibold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700/50 w-full rounded-bl-xl"
        title="Excluir tarefa"
      >
        <svg class="size-5 flex-none text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Excluir
      </button>
      <button
        @click="toggleTask(task)"
        :class="['flex items-center justify-center gap-x-2.5 p-4 text-base font-semibold w-full rounded-br-xl', task.completed ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30' : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700/50']"
        title="Marcar como concluída"
      >
        <svg v-if="!task.completed" class="size-5 flex-none text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        <svg v-else class="size-5 flex-none text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.5a1 1 0 0 1-1.42.012l-3.25-3.25a1 1 0 1 1 1.414-1.414l2.543 2.543 6.543-6.764a1 1 0 0 1 1.414-.041z" clip-rule="evenodd" />
        </svg>
        <span v-if="!task.completed">Concluir</span>
        <span v-else>Concluída</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import type { Task } from '@/types'
import { useTasksStore } from '@/stores/tasks'

const props = defineProps<{
  task: Task
  isFavorite?: boolean
  editTaskId: number | null
  editTitle: string
}>()
const emit = defineEmits(['favorite-toggled'])
const tasksStore = useTasksStore()

const editingTitle = ref(false)
const localTitle = ref(props.task.title)

watch(
  () => props.task.title,
  (newTitle) => {
    localTitle.value = newTitle
  },
)

function startEditTitle() {
  editingTitle.value = true
  // Focus automático será feito pelo :autofocus
}

async function saveTitle() {
  if (localTitle.value.trim() && localTitle.value !== props.task.title) {
    await tasksStore.updateTask(props.task.folder.id, props.task.id, {
      title: localTitle.value,
    })
  }
  editingTitle.value = false
}

function cancelEditTitle() {
  localTitle.value = props.task.title
  editingTitle.value = false
}

function onToggleFavorite() {
  tasksStore.toggleFavorite(props.task.folder.id, props.task.id)
  emit('favorite-toggled', props.task.id)
}

function autoResize(e: Event) {
  const ta = e.target as HTMLTextAreaElement
  ta.style.height = '2.5rem'
  ta.style.height = ta.scrollHeight + 'px'
}

function deleteTask(task: Task) {
  // Lógica para excluir a tarefa
}

function toggleTask(task: Task) {
  // Lógica para marcar a tarefa como concluída
}
</script>

<style scoped></style>
