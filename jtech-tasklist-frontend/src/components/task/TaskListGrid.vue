<script setup lang="ts">
import TaskCard from './TaskCard.vue'
import type { Task } from '@/types/task'

defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  showDetails: [taskId: string]
  toggleComplete: [taskId: string]
}>()
</script>

<template>
  <div class="flex-1 overflow-y-auto pr-2 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-min">
    <TaskCard
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @click="emit('showDetails', task.id)"
      @toggle-complete="emit('toggleComplete', task.id)"
    />
  </div>
</template>
