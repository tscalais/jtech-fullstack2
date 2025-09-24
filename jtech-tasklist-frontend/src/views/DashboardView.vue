<template>
  <v-container fluid>
    <v-row>
      <v-col
b
      >
        <list-selector
          :lists="listsStore.lists"
          :activeListId="listsStore.activeListId"
          @update:activeList="listsStore.setActiveList"
          @addList="handleAddList"
          @deleteList="handleDeleteList">
        </list-selector>
      </v-col>
      <v-col

      >
        <task-list
          v-if="listsStore.activeListId"
          :tasks="activeTasks"
          @addTask="handleAddTask"
          @toggleTask="tasksStore.toggleTask"
          @deleteTask="tasksStore.deleteTask">
        </task-list>
        <v-alert v-else type="info">
          Selecione uma lista ou crie uma nova.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// Componentes customizados
import ListSelector from '@/components/ListSelector.vue';
import TaskList from '@/components/TaskList.vue';
// Componentes do Vuetify necessários para esta view
import { VContainer, VRow, VCol, VAlert } from 'vuetify/components';
// Stores
import { useAuthStore } from '@/stores/auth';
import { useListsStore } from '@/stores/lists';
import { useTasksStore } from '@/stores/tasks';

const authStore = useAuthStore();
const listsStore = useListsStore();
const tasksStore = useTasksStore();
const router = useRouter();

// Sua lógica de script continua a mesma...
onMounted(() => {
  if (listsStore.lists.length === 0 && authStore.isAuthenticated) {
    listsStore.createList('Tarefas Principais');
  }
});

const activeTasks = computed(() => {
  if (!listsStore.activeListId) return [];
  return tasksStore.tasks[listsStore.activeListId] || [];
});

const handleAddList = (listName: string) => {
  listsStore.createList(listName);
};

const handleDeleteList = (listId: string) => {
  listsStore.deleteList(listId);
  tasksStore.deleteTasksByListId(listId);
};

const handleAddTask = (taskTitle: string) => {
  if (listsStore.activeListId) {
    tasksStore.addTask(listsStore.activeListId, taskTitle);
  }
};
</script>
