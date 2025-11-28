<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTagsStore } from '@/stores/tags'
import { useFoldersStore } from '@/stores/folders'
import type { Tag } from '@/types/tag'

const newTaskTitle = ref('')
const showTagSelector = ref(false)
const selectedTags = ref<Tag[]>([])

const tagsStore = useTagsStore()
const foldersStore = useFoldersStore()

const emit = defineEmits<{
  createTask: [title: string, tags: Tag[]]
}>()

const availableTags = computed(() => tagsStore.tags)

// Fetch tags when folder changes or component mounts
watch(() => foldersStore.currentFolderId, (newId) => {
  if (newId) {
    tagsStore.fetchTags(newId)
    selectedTags.value = []
  }
}, { immediate: true })

const toggleTag = (tag: Tag) => {
  const index = selectedTags.value.findIndex(t => t.id === tag.id)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

const isTagSelected = (tag: Tag) => {
  return selectedTags.value.some(t => t.id === tag.id)
}

const getTagColor = (tag: Tag) => {
  return tag.color || 'blue'
}

const handleSubmit = () => {
  if (newTaskTitle.value.trim()) {
    emit('createTask', newTaskTitle.value, selectedTags.value)
    newTaskTitle.value = ''
    selectedTags.value = []
    showTagSelector.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-xl mx-auto mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700 relative">
    <input
      v-model="newTaskTitle"
      type="text"
      placeholder="Criar nova tarefa... (Ex: Implementar CRUD de Tasks)"
      class="w-full text-lg font-medium text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none bg-transparent"
      @keyup.enter="handleSubmit"
    />

    <!-- Selected Tags Display -->
    <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mt-2">
      <span
        v-for="tag in selectedTags"
        :key="tag.id"
        :class="`text-xs px-2 py-1 rounded-full bg-${getTagColor(tag)}-100 text-${getTagColor(tag)}-700 flex items-center space-x-1`"
      >
        <span>#{{ tag.name }}</span>
        <button @click="toggleTag(tag)" class="hover:text-red-500">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </span>
    </div>

    <div class="mt-3 flex justify-end space-x-2 relative">
      <div class="relative">
        <button
          class="text-gray-400 hover:text-primary-600 p-1 rounded-full transition-colors"
          title="Adicionar Tag"
          @click="showTagSelector = !showTagSelector"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </button>

        <!-- Tag Selector Popover -->
        <div
          v-if="showTagSelector"
          class="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-10"
        >
          <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">Selecionar Tags</p>
          <div class="max-h-40 overflow-y-auto space-y-1">
            <button
              v-for="tag in availableTags"
              :key="tag.id"
              @click="toggleTag(tag)"
              class="w-full text-left px-2 py-1.5 rounded-md text-sm flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :class="{'bg-primary-50 dark:bg-primary-900/20': isTagSelected(tag)}"
            >
              <span :class="`text-${getTagColor(tag)}-600 dark:text-${getTagColor(tag)}-400 font-medium`">#{{ tag.name }}</span>
              <svg v-if="isTagSelected(tag)" class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </button>
            <p v-if="availableTags.length === 0" class="text-xs text-gray-400 text-center py-2">Nenhuma tag disponível</p>
          </div>
        </div>
      </div>

      <button
        class="bg-primary-600 text-white py-1 px-3 rounded-lg hover:bg-primary-700 transition duration-150 text-sm font-medium shadow-md"
        @click="handleSubmit"
      >
        Salvar
      </button>
    </div>
    
    <!-- Backdrop for popover -->
    <div v-if="showTagSelector" class="fixed inset-0 z-0" @click="showTagSelector = false"></div>
  </div>
</template>
