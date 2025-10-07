<template>
  <div class="bg-gray-900 py-12 sm:py-20">
    <div class="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
      <h2 class="text-center text-base font-semibold text-indigo-400">Suas Tarefas</h2>
      <p class="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">Organize e priorize suas tarefas</p>
      <div class="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
        <!-- Tarefa favorita principal (primeira) -->
        <TaskCard
          v-if="favoriteTasks.length > 0"
          :task="favoriteTasks[0]"
          :isFavorite="true"
          :editTaskId="editTaskId"
          :editTitle="editTitle"
          @edit="startEdit"
          @cancel-edit="cancelEdit"
          @delete="deleteTask"
          @toggle-favorite="toggleFavorite"
          @toggle-completed="toggleTask"
          @save-edit="saveEdit"
          v-model:editTitle="editTitle"
        />

        <!-- Lista Bento das demais tarefas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <TaskCard
            v-for="task in favoriteTasks.slice(1)"
            :key="task.id"
            :task="task"
            :isFavorite="false"
            :editTaskId="editTaskId"
            :editTitle="editTitle"
            @edit="startEdit"
            @cancel-edit="cancelEdit"
            @delete="deleteTask"
            @toggle-favorite="toggleFavorite"
            @toggle-completed="toggleTask"
            @save-edit="saveEdit"
          />
          <TaskCard
            v-for="task in unfavoritedTasks"
            :key="task.id"
            :task="task"
            :isFavorite="false"
            :editTaskId="editTaskId"
            :editTitle="editTitle"
            @edit="startEdit"
            @cancel-edit="cancelEdit"
            @delete="deleteTask"
            @toggle-favorite="toggleFavorite"
            @toggle-completed="toggleTask"
            @save-edit="saveEdit"
          />
          <!-- Mensagem caso não haja tarefas -->
          <div v-if="favoriteTasks.length === 0 && unfavoritedTasks.length === 0" class="col-span-full text-gray-400 italic text-center py-12">Nenhuma tarefa encontrada.</div>
        </div>
        <!-- Formulário para nova tarefa -->
        <form @submit.prevent="addTask" class="flex gap-2 mt-10 justify-center">
          <input
            v-model="newTaskTitle"
            placeholder="Nova tarefa"
            class="border rounded px-2 py-1 text-sm flex-1 max-w-xs"
            required
          />
          <button type="submit" class="bg-indigo-500 text-white px-3 py-1 rounded text-sm">Adicionar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TaskCard from './TaskCard.vue'
import { ref, watch, computed, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'
import { defineProps } from 'vue'
import type { Task } from '@/types'

const props = defineProps<{ folderId: number }>()
const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const newTaskTitle = ref('')
const editTaskId = ref<number | null>(null)
const editTitle = ref('')

const tasksInFolder = computed(() => tasks.value.filter(t => t.folder.id === props.folderId))
const favoriteTasks = computed(() => tasksInFolder.value.filter(t => t.favorite))
const unfavoritedTasks = computed(() => tasksInFolder.value.filter(t => !t.favorite))

onMounted(() => {
  if (props.folderId) {
    tasksStore.fetchTasks(props.folderId)
  }
})

watch(() => props.folderId, () => {
  tasksStore.fetchTasks(props.folderId)
})

function addTask() {
  if (!newTaskTitle.value.trim()) return
  tasksStore.createTask(props.folderId, {
    title: newTaskTitle.value,
    description: '',
    completed: false,
    favorite: false,
  })
  newTaskTitle.value = ''
}

function startEdit(task: Task) {
  editTaskId.value = task.id
  editTitle.value = task.title
}

function saveEdit(task: Task) {
  if (editTitle.value.trim() && editTitle.value !== task.title) {
    tasksStore.updateTask(props.folderId, task.id, { title: editTitle.value })
  }
  editTaskId.value = null
  editTitle.value = ''
}

function cancelEdit() {
  editTaskId.value = null
  editTitle.value = ''
}

function deleteTask(task: Task) {
  tasksStore.deleteTask(props.folderId, task.id)
}

function toggleTask(task: Task) {
  tasksStore.updateTask(props.folderId, task.id, { completed: !task.completed })
}

function toggleFavorite(task: Task) {
  tasksStore.updateTask(props.folderId, task.id, { favorite: !task.favorite })
}
</script>

<style scoped>
:root {
  --radius-lg: 1rem;
}
</style>
