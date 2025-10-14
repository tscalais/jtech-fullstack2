<script setup lang="ts">
import { ref } from 'vue'

const newTaskTitle = ref('')

const emit = defineEmits<{
  createTask: [title: string]
}>()

const handleSubmit = () => {
  if (newTaskTitle.value.trim()) {
    emit('createTask', newTaskTitle.value)
    newTaskTitle.value = ''
  }
}
</script>

<template>
  <div class="w-full max-w-xl mx-auto mb-8 bg-white rounded-xl shadow-md p-4 border border-gray-200">
    <input
      v-model="newTaskTitle"
      type="text"
      placeholder="Criar nova tarefa... (Ex: Implementar CRUD de Tasks)"
      class="w-full text-lg font-medium text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
      @keyup.enter="handleSubmit"
    />

    <div class="mt-3 flex justify-end space-x-2">
      <button
        class="text-gray-400 hover:text-primary-600 p-1 rounded-full"
        title="Adicionar Tag"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5.99c.55 0 1 .45 1 1v5.99c0 .55-.45 1-1 1H7.01c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1zM17 17h.01M17 13h5.99c.55 0 1 .45 1 1v5.99c0 .55-.45 1-1 1H17.01c-.55 0-1-.45-1-1v-5.99c0-.55.45-1 1-1zM7 17h.01M7 13h5.99c.55 0 1 .45 1 1v5.99c0 .55-.45 1-1 1H7.01c-.55 0-1-.45-1-1v-5.99c0-.55.45-1 1-1z" />
        </svg>
      </button>

      <button
        class="bg-primary-600 text-white py-1 px-3 rounded-lg hover:bg-primary-700 transition duration-150 text-sm font-medium shadow-md"
        @click="handleSubmit"
      >
        Salvar
      </button>
    </div>
  </div>
</template>
