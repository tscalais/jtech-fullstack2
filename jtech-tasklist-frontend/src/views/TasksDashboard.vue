<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h2 class="text-xl font-bold mb-4">Tarefas</h2>
    <div class="overflow-auto mb-4" style="max-height: 60vh;">
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li
          v-for="task in tasks"
          :key="task.id"
          :class="[ 'flex items-center justify-between py-2 px-2 cursor-pointer rounded transition', task.id === activeTaskId ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700' ]"
          @click="$emit('atualizar:taskAtiva', task.id)"
        >
          <div class="flex-1">
            <div v-if="estaEditando && task.id === activeTaskId" class="flex items-center gap-2">
              <input
                ref="titleInput"
                v-model="tituloTaskEdicao"
                class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                @blur="descartarRenomeacao"
                @keyup.esc="descartarRenomeacao"
                @keyup.enter="salvarRenomeacao"
              />
              <button type="button" @click="salvarRenomeacao" class="text-green-600 hover:text-green-800" title="Salvar">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              </button>
            </div>
            <span v-else>{{ task.title }}</span>
          </div>
          <div v-if="task.id === activeTaskId && !estaEditando" class="flex gap-2 ml-2">
            <button type="button" data-testid="excluir-task" @click.stop="$emit('excluir:task', task.id)" class="text-red-500 hover:text-red-700" title="Excluir">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            </button>
            <button type="button" data-testid="editar-task" @click.stop="iniciarRenomeacao(task.title)" class="text-blue-500 hover:text-blue-700" title="Editar">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" /></svg>
            </button>
          </div>
        </li>
      </ul>
    </div>
    <form @submit.prevent="criarTask" class="flex items-center gap-2">
      <input
        v-model="tituloTaskNova"
        :class="[ 'border rounded px-2 py-1 flex-1', erroTask ? 'border-red-500' : 'border-gray-300 dark:border-gray-600' ]"
        placeholder="Nova Tarefa"
        required
        @input="erroTask = ''"
      />
      <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1" title="Adicionar">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
      </button>
    </form>
    <div v-if="erroTask" class="text-red-500 text-xs mt-1">{{ erroTask }}</div>
  </div>
</template>

<script lang="ts" setup>
import type { Task } from '@/types'
import { defineEmits, defineProps, ref } from 'vue'

const { tasks, activeTaskId } = defineProps<{
  tasks: Task[]
  activeTaskId: number
}>()

const emits = defineEmits([
  'atualizar:taskAtiva',
  'adicionar:task',
  'excluir:task',
  'renomear:task',
])
const tituloTaskNova = ref('')
const tituloTaskEdicao = ref('')
const estaEditando = ref(false)
const erroTask = ref('')

const iniciarRenomeacao = (nomeTask: string) => {
  tituloTaskEdicao.value = nomeTask
  estaEditando.value = true
}

const criarTask = () => {
  if (tituloTaskNova.value.trim()) {
    erroTask.value = ''
    emits('adicionar:task', tituloTaskNova.value.trim())
    tituloTaskNova.value = ''
  }
}

const mostrarErroTask = (mensagem: string) => {
  erroTask.value = mensagem
}

// Expor função para componente pai
defineExpose({
  mostrarErroTask,
})

const salvarRenomeacao = () => {
  if (tituloTaskEdicao.value.trim() !== '') {
    emits('renomear:task', tituloTaskEdicao.value.trim())
  }
  estaEditando.value = false
}

const descartarRenomeacao = () => {
  estaEditando.value = false
}
</script>

<style scoped>
</style>
