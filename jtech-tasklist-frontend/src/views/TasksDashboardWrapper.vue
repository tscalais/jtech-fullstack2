<template>
  <TasksDashboard
    :tasks="tasksStore.tasks"
    :activeTaskId="tasksStore.activeTaskId"
    @atualizar:taskAtiva="tasksStore.activeTaskId = $event"
    @adicionar:task="handleAddTask"
    @excluir:task="handleDeleteTask"
    @renomear:task="handleRenameTask"
  />
</template>

<script lang="ts" setup>
import { useTasksStore } from '@/stores/tasks'
import TasksDashboard from './TasksDashboard.vue'
import { onMounted } from 'vue'
import { useFoldersStore } from '@/stores/folders'

const tasksStore = useTasksStore()
const foldersStore = useFoldersStore()

onMounted(() => {
  // Busca tarefas da pasta ativa ao montar
  if (foldersStore.activeFolderId) {
    tasksStore.fetchTasks(foldersStore.activeFolderId)
  }
})

function handleAddTask(title: string) {
  if (foldersStore.activeFolderId) {
    tasksStore.createTask(foldersStore.activeFolderId, { title })
  }
}

function handleDeleteTask(taskId: number) {
  if (foldersStore.activeFolderId) {
    tasksStore.deleteTask(foldersStore.activeFolderId, taskId)
  }
}

function handleRenameTask({ id, title }: { id: number; title: string }) {
  if (foldersStore.activeFolderId) {
    tasksStore.updateTask(foldersStore.activeFolderId, id, { title })
  }
}
</script>

