<template>
  <v-card>
    <v-card-title>Subtasks</v-card-title>
    <v-form @submit.prevent="adicionarSubtaskLocal">
      <v-text-field
        v-model="tituloNovaSubtask"
        :error="!!erroSubtask"
        :error-messages="erroSubtask"
        append-inner-icon="mdi-plus"
        label="New Subtask"
        @input="erroSubtask = ''"
        @click:append-inner="adicionarSubtaskLocal"
      ></v-text-field>
    </v-form>
    <div class="task-scroll-container">
      <v-list>
        <v-list-item v-for="subtask in subtasksForTask" :key="subtask.id">
          <template #prepend>
            <v-list-item-action>
              <v-checkbox-btn
                :model-value="subtask.concluida"
                @update:model-value="alternarSubtask(subtask.id)"
              ></v-checkbox-btn>
            </v-list-item-action>
          </template>
          <v-list-item-title :class="{ 'text-decoration-line-through': subtask.concluida }">
            {{ subtask.name }}
          </v-list-item-title>
          <template #append>
            <span size="small" @click.stop="excluirSubtask(subtask.id)">
              <v-icon color="red">mdi-delete-circle</v-icon>
            </span>
          </template>
        </v-list-item>
      </v-list>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useSubtasksStore } from '@/stores/subtasks'
import { computed, ref } from 'vue'

const props = defineProps<{ taskId: number }>()
const subtasksStore = useSubtasksStore()
const { subtasks } = storeToRefs(subtasksStore)

const tituloNovaSubtask = ref('')
const erroSubtask = ref('')

const subtasksForTask = computed(() => subtasks.value[props.taskId] || [])

function adicionarSubtaskLocal() {
  if (!tituloNovaSubtask.value.trim()) {
    erroSubtask.value = 'Título obrigatório'
    return
  }
  try {
    subtasksStore.adicionarSubtask(props.taskId, tituloNovaSubtask.value)
    tituloNovaSubtask.value = ''
    erroSubtask.value = ''
  } catch (e: any) {
    erroSubtask.value = e.message || 'Erro ao adicionar subtarefa'
  }
}

function alternarSubtask(subtaskId: number) {
  subtasksStore.alternarSubtask(props.taskId, subtaskId)
}

function excluirSubtask(subtaskId: number) {
  subtasksStore.excluirSubtask(props.taskId, subtaskId)
}
</script>

<style scoped>
.task-scroll-container {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
