<template>
  <v-card class="pa-4">
    <v-card-title>Tarefas </v-card-title>
    <div class="overflow-auto mb-4" style="max-height: 60vh;">
      <v-list dense nav>
        <div>
          <v-list-item
            v-for="task in tasks"
            :key="task.id"
            :active="task.id === activeTaskId"
            @click="$emit('atualizar:taskAtiva', task.id)"
          >
            <v-list-item-title>
              <v-text-field
                v-if="estaEditando && task.id === activeTaskId"
                ref="titleInput"
                v-model="tituloTaskEdicao"
                append-inner-icon="mdi-check"
                density="compact"
                hide-details
                single-line
                @blur="descartarRenomeacao"
                @keyup.esc="descartarRenomeacao"
                @keyup.enter="salvarRenomeacao"
                @click:append-inner="salvarRenomeacao"
              >
              </v-text-field>

              {{ task.title }}
            </v-list-item-title>
            <template v-if="task.id === activeTaskId && !estaEditando" #append>
              <span size="small" data-testid="excluir-task" @click.stop="$emit('excluir:task', task.id)">
                <v-icon color="red">mdi-delete-circle</v-icon>
              </span>
              <span size="small" data-testid="editar-task" @click.stop="iniciarRenomeacao(task.title)">
                <v-icon color="blue">mdi-pencil-circle</v-icon>
              </span>
            </template>
          </v-list-item>
        </div>
      </v-list>
    </div>

    <v-form @submit.prevent="criarTask">
      <v-text-field
        v-model="tituloTaskNova"
        :error="!!erroTask"
        :error-messages="erroTask"
        append-inner-icon="mdi-plus"
        density="compact"
        label="Nova Tarefa"
        required
        @input="erroTask = ''"
        @click:append-inner="criarTask"
      ></v-text-field>
    </v-form>
  </v-card>
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
