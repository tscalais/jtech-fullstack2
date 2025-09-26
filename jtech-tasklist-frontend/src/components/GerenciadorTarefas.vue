<template>
  <v-card>
    <v-card-title>Tarefas</v-card-title>
    <v-form @submit.prevent="adicionarTarefaLocal">
      <v-text-field
        v-model="tituloNovaTarefa"
        label="Nova Tarefa"
        append-inner-icon="mdi-plus"
        @click:append-inner="adicionarTarefaLocal"
      ></v-text-field>
    </v-form>
    <div class="task-scroll-container">
      <v-list>
        <v-list-item v-for="tarefa in tarefas" :key="tarefa.id">
          <template #prepend>
            <v-list-item-action>
              <v-checkbox-btn
                :model-value="tarefa.concluida"
                @update:model-value="$emit('alternar:tarefa', tarefa.id)"
              ></v-checkbox-btn>
            </v-list-item-action>
          </template>
          <v-list-item-title :class="{ 'text-decoration-line-through': tarefa.concluida }">
            {{ tarefa.titulo }}
          </v-list-item-title>
          <template #append>
            <span size="small" @click.stop="$emit('excluir:tarefa', tarefa.id)">
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
import type { Tarefa } from '@/types'

defineProps<{
  tarefas: Tarefa[]
}>()

const emits = defineEmits(['adicionar:tarefa', 'alternar:tarefa', 'excluir:tarefa'])
const tituloNovaTarefa = ref('')

function adicionarTarefaLocal() {
  if (tituloNovaTarefa.value.trim()) {
    emits('adicionar:tarefa', tituloNovaTarefa.value)
    tituloNovaTarefa.value = ''
  }
}
</script>

<style scoped>
.task-scroll-container {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
