<script setup lang="ts">
import { computed } from 'vue'
import type { Task, Tag } from '@/types/task'


const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  click: [taskId: string]
  toggleComplete: [taskId: string]
}>()

const borderColor = computed(() => {
  if (props.task.completed) return 'border-green-300'
  if (props.task.tags?.some((t: Tag) => t.name === 'Urgente')) return 'border-yellow-300'
  return 'border-gray-300'
})

const handleCheckboxClick = (e: Event) => {
  e.stopPropagation()
  emit('toggleComplete', String(props.task.id))
}
</script>

<template>
  <div
    :class="[
      'bg-white rounded-xl shadow-sm p-4 border cursor-pointer hover:shadow-lg transition duration-200',
      borderColor,
    ]"
    @click="emit('click', String(task.id))"
  >
    <p :class="['text-lg font-bold text-gray-800 mb-2', task.completed && 'line-through']">
      {{ task.title }}
    </p>

    <div class="flex items-center space-x-2 text-sm text-gray-500 mb-3">
      <input
        type="checkbox"
        :checked="task.completed"
        :class="[
          'form-checkbox h-4 w-4 rounded border-gray-300 transition duration-150',
          task.completed
            ? 'text-green-500 focus:ring-green-500'
            : 'text-gray-400 focus:ring-primary-500',
        ]"
        @click="handleCheckboxClick"
      />

      <span class="flex items-center space-x-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        <span>{{ task.subtasks.length }}/{{ task.subtasks.length }} Microtarefas</span>
      </span>
    </div>

    <div class="flex flex-wrap gap-1 mt-auto">
      <span
        v-for="tag in task.tags"
        :key="tag.name"
        :class="[
          'text-xs font-semibold px-2 py-0.5 rounded-full',
          `bg-${tag.color}-100 text-${tag.color}-600`,
        ]"
      >
        #{{ tag.name }}
      </span>
    </div>
  </div>
</template>
