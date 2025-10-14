<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Task, Subtask } from '@/types/task'
import { useSubtasksStore } from '@/stores/subtasks'
import { useTagsStore } from '@/stores/tags'

const props = defineProps<{
  task: Task | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  delete: [taskId: number]
  complete: [taskId: number]
}>()

const newSubtaskText = ref('')
const showDeleteConfirm = ref(false)

const subtasksStore = useSubtasksStore()
const tagsStore = useTagsStore()

watch(() => props.task, async (task) => {
  if (task && props.isOpen) {
    await subtasksStore.fetchSubtasks(task.folder.id, task.id)
    await tagsStore.fetchTags(task.folder.id)
  }
}, { immediate: true })

const subtasks = computed(() => subtasksStore.subtasks)
const tags = computed(() => tagsStore.tags)
const completedSubtasks = computed(() => subtasks.value.filter((s: Subtask) => s.completed).length)
const totalSubtasks = computed(() => subtasks.value.length)

const handleClose = () => {
  emit('close')
  showDeleteConfirm.value = false
}

async function handleAddSubtask() {
  if (!props.task || !newSubtaskText.value.trim()) return
  await subtasksStore.addSubtask(props.task.folder.id, props.task.id, { description: newSubtaskText.value })
  newSubtaskText.value = ''
}

async function handleAddTag(tagId: number) {
  if (!props.task) return
  await tagsStore.associateTag(props.task.id, tagId)
}

async function handleRemoveTag(tagId: number) {
  if (!props.task) return
  await tagsStore.dissociateTag(props.task.id, tagId)
}

function handleToggleSubtask(subtask: Subtask) {
  // Implemente a lógica de toggle na API, se necessário
}
function handleRemoveSubtask(subtaskId: number) {
  // Implemente a lógica de deleção na API, se necessário
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
            <h4 class="font-semibold mb-2">Microtarefas ({{ completedSubtasks }}/{{ totalSubtasks }})</h4>
            <div class="flex space-x-2">
              <input
                v-model="newSubtaskText"
                type="text"
                placeholder="Nova microtarefa..."
                class="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <button
                @click="handleAddSubtask"
                class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Add
              </button>
            </div>

            <!-- Existing Subtasks -->
            <div class="mt-4">
              <div
                v-for="subtask in subtasks"
                :key="subtask.id"
                class="flex items-center justify-between p-2 border-b"
              >
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="subtask.completed"
                    @change="handleToggleSubtask(subtask)"
                    class="mr-2"
                  />
                  <span :class="`line-through text-gray-400`" v-if="subtask.completed">
                    {{ subtask.description }}
                  </span>
                  <span v-else>{{ subtask.description }}</span>
                </div>
                <button
                  @click="handleRemoveSubtask(subtask.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
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
