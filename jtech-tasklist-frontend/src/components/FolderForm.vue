<template>
  <form @submit.prevent="onSubmit" ref="formRef" class="space-y-3">
    <div>
      <label for="folder-name" class="block text-sm font-medium text-gray-700">Nome da Pasta</label>
      <input
        id="folder-name"
        v-model="folderData.name"
        type="text"
        required
        autofocus
        :disabled="props.loading ?? foldersLoading.value"
        class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
        :class="{'border-red-500': showError}"
        @blur="validate"
        @input="showError = false"
      />
      <p v-if="showError" class="text-xs text-red-600 mt-1">Nome é obrigatório</p>
    </div>
    <button
      type="submit"
      :disabled="props.loading ?? foldersLoading.value"
      class="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <svg v-if="props.loading ?? foldersLoading.value" class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
      {{ props.isEdit ? 'Salvar' : 'Criar' }}
    </button>
    <button
      v-if="props.isEdit"
      type="button"
      class="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
      @click="$emit('cancel')"
    >
      Cancelar
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { storeToRefs } from 'pinia'
import { useFoldersStore } from '@/stores/folders'

interface FolderFormData {
  name: string
}

const props = defineProps<{
  modelValue?: FolderFormData | null
  loading?: boolean
  isEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: FolderFormData): void
  (e: 'cancel'): void
}>()

const folderData = ref<FolderFormData>({ name: '' })
const formRef = ref()
const foldersStore = useFoldersStore()
const { loading: foldersLoading } = storeToRefs(foldersStore)
const showError = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    folderData.value = val ? { ...val } : { name: '' }
  },
  { immediate: true }
)

function validate() {
  showError.value = !folderData.value.name
}

function onSubmit() {
  if (!folderData.value.name) {
    showError.value = true
    return
  }
  emit('submit', { ...folderData.value })
}
</script>

<style scoped>
/* All styles handled by Tailwind */
</style>
