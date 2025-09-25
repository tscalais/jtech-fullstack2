<template>
  <v-card>
    <v-card-title>Tarefas</v-card-title>
    <v-form @submit.prevent="handleAddTask">
      <v-text-field
        v-model="newTaskTitle"
        label="Nova Tarefa"
        append-inner-icon="mdi-plus"
        @click:append-inner="handleAddTask"
      ></v-text-field>
    </v-form>
    <div class="task-scroll-container">
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
            <span size="small" @click.stop="$emit('deleteTask', task.id)">
              <v-icon color="red">mdi-delete-circle</v-icon>
            </span>
          </template>
        </v-list-item>
      </v-list>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import type { Task } from '@/types'

defineProps<{
  tasks: Task[]
}>()

const emits = defineEmits(['addTask', 'toggleTask', 'deleteTask'])
const newTaskTitle = ref('')

function handleAddTask() {
  if (newTaskTitle.value.trim()) {
    emits('addTask', newTaskTitle.value)
    newTaskTitle.value = ''
  }
}
</script>

<style scoped>
.task-scroll-container {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
