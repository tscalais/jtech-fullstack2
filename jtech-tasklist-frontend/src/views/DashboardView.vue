<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12" md="4" lg="3" xl="2">
        <list-selector
          :lists="listsStore.lists"
          :activeListId="listsStore.activeListId"
          @update:activeList="listsStore.setActiveList"
          @addList="handleAddList"
          @deleteList="handleDeleteList"
          @renameList="handleRenameList"
        >
        </list-selector>
      </v-col>

      <v-col cols="12" md="8" lg="9" xl="10">
        <task-list
          v-if="listsStore.activeListId"
          :tasks="activeTasks"
          @addTask="handleAddTask"
          @toggleTask="handleToggleTask"
          @deleteTask="handleDeleteTask"
        >
        </task-list>
        <v-alert v-else type="info"> Selecione uma lista ou crie uma nova. </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
//import { useRouter } from 'vue-router';

// Meus Componentes
import ListSelector from '@/components/ListSelector.vue'
import TaskList from '@/components/TaskList.vue'

// Componentes do Vuetify necessários para esta view
import { VContainer, VRow, VCol, VAlert } from 'vuetify/components'

// Stores
import { useAuthStore } from '@/stores/auth'
import { useListsStore } from '@/stores/lists'
import { useTasksStore } from '@/stores/tasks'

const authStore = useAuthStore()
const listsStore = useListsStore()
const tasksStore = useTasksStore()
//const router = useRouter();

onMounted(() => {
  if (listsStore.lists.length === 0 && authStore.isAuthenticated) {
    listsStore.createList('Tarefas Principais')
  }
})

const activeTasks = computed(() => {
  if (!listsStore.activeListId) return []
  return tasksStore.tasks[listsStore.activeListId] || []
})

const handleAddList = (listName: string) => {
  listsStore.createList(listName)
}

const handleDeleteList = (listId: number) => {
  listsStore.deleteList(listId)
  tasksStore.deleteTasksByListId(listId)
}

const handleRenameList = (newName: string) => {
  if (listsStore.activeListId) {
    listsStore.renameList(listsStore.activeListId, newName)
  }
}

const handleToggleTask = (taskId: number) => {
  tasksStore.toggleTask(listsStore.activeListId, taskId)
}

const handleDeleteTask = (taskId: number) => {
  tasksStore.deleteTask(listsStore.activeListId, taskId)
}

const handleAddTask = (taskTitle: string) => {
  if (listsStore.activeListId) {
    tasksStore.addTask(listsStore.activeListId, taskTitle)
  }
}
</script>
