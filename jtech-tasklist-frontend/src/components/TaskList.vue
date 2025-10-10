<template>
  <div class="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
    <!-- Linha de favoritos -->
    <div v-if="favoriteTasks.length" class="mb-8">
      <div class="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <TaskCard
          v-for="task in favoriteTasks"
          :key="task.id"
          :task="task"
          :isFavorite="task.favorite"
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
      </div>

    </div>
    <!-- Linha de tarefas normais -->
    <div class="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <TaskCard
        v-for="task in nonFavoriteTasks"
        :key="task.id"
        :task="task"
        :isFavorite="task.favorite"
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
    </div>
  </div>
</template>

<script setup lang="ts">
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

const tasksInFolder = computed(() => tasks.value.filter((t) => t.folder.id === props.folderId))
const favoriteTasks = computed(() => tasksInFolder.value.filter(t => t.favorite))
const nonFavoriteTasks = computed(() => tasksInFolder.value.filter(t => !t.favorite))

onMounted(() => {
  if (props.folderId) {
    tasksStore.fetchTasks(props.folderId)
  }
})

watch(
  () => props.folderId,
  () => {
    tasksStore.fetchTasks(props.folderId)
  },
)

function addTask() {
  if (!newTaskTitle.value.trim()) return
  tasksStore.createTask(props.folderId, {
    title: newTaskTitle.value,
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
  tasksStore.toggleFavorite(props.folderId, task.id)
}

// CRUD extra: marcar/desmarcar concluída
function markCompleted(task: Task) {
  if (!task.completed) {
    tasksStore.updateTask(props.folderId, task.id, { completed: true })
  }
}

function markUncompleted(task: Task) {
  if (task.completed) {
    tasksStore.updateTask(props.folderId, task.id, { completed: false })
  }
}
</script>

<style scoped>
:root {
  --radius-lg: 1rem;
}
</style>
