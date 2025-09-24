<template>
  <v-card  >
    <v-card-title>Tarefas</v-card-title>
    <v-form @submit.prevent="handleAddTask">
      <v-text-field
        v-model="newTaskTitle"
        label="Nova Tarefa"
        append-inner-icon="mdi-plus"
        @click:append-inner="handleAddTask"
      ></v-text-field>
    </v-form>

    <v-list>
      <v-list-item v-for="task in tasks" :key="task.id">
        <template #prepend>
          <v-list-item-action>
            <v-checkbox-btn
              :model-value="task.completed"
              @update:model-value="$emit('toggleTask', task.id)"
            ></v-checkbox-btn>
          </v-list-item-action>
        </template>
        <v-list-item-title :class="{ 'text-decoration-line-through': task.completed }">
          {{ task.title }}
        </v-list-item-title>
        <template #append>
          <v-btn icon size="small" @click="$emit('deleteTask', task.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { Task } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  tasks: Task[];
}>();

const emits = defineEmits(['addTask', 'toggleTask', 'deleteTask']);
const newTaskTitle = ref('');

function handleAddTask() {
  if (newTaskTitle.value.trim()) {
    emits('addTask', newTaskTitle.value);
    newTaskTitle.value = '';
  }
}
</script>
