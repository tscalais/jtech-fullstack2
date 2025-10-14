<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task } from '@/types/task'

const props = defineProps<{
  task: Task | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  delete: [taskId: string]
  complete: [taskId: string]
}>()

const newSubtaskText = ref('')
const showDeleteConfirm = ref(false)

const handleClose = () => {
  emit('close')
  showDeleteConfirm.value = false
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && task"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click.self="handleClose"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        <!-- Header -->
        <div class="flex items-center justify-between border-b px-6 py-4">
          <h2 class="text-xl font-bold">{{ task.title }}</h2>
          <button @click="handleClose" class="text-gray-500 hover:text-gray-800">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in task.tags"
              :key="tag.name"
              :class="`bg-${tag.color}-100 text-${tag.color}-600 text-sm px-3 py-1 rounded-full font-semibold`"
            >
              #{{ tag.name }}
            </span>
          </div>

          <!-- Subtasks -->
          <div>
            <h4 class="font-semibold mb-2">Microtarefas ({{ task.subtasks }}/{{ task.maxSubtasks }})</h4>
            <div class="flex space-x-2">
              <input
                v-model="newSubtaskText"
                type="text"
                placeholder="Nova microtarefa..."
                class="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <button class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                Add
              </button>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="flex justify-between px-6 py-4 bg-gray-50 border-t">
          <button
            v-if="!showDeleteConfirm"
            @click="showDeleteConfirm = true"
            class="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg border border-red-300"
          >
            Excluir
          </button>
          <div v-else class="flex space-x-2">
            <button @click="emit('delete', task.id)" class="bg-red-600 text-white px-4 py-2 rounded-lg">
              Confirmar
            </button>
            <button @click="showDeleteConfirm = false" class="bg-gray-200 px-4 py-2 rounded-lg">
              Cancelar
            </button>
          </div>

          <button
            @click="emit('complete', task.id)"
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Concluir
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>
