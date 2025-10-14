<script setup lang="ts">
import { ref } from 'vue'

interface TagFilterItem {
  name: string
  color: string
}

const props = defineProps<{
  activeTag?: string | null
}>()

const emit = defineEmits<{
  selectTag: [tagName: string]
}>()

const tags = ref<TagFilterItem[]>([
  { name: 'Backend', color: 'primary' },
  { name: 'Urgente', color: 'yellow' },
  { name: 'Documentação', color: 'gray' },
  { name: 'Frontend', color: 'indigo' },
])

const selectTag = (tagName: string) => {
  emit('selectTag', tagName)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 mb-6 w-full max-w-xl mx-auto lg:max-w-none lg:mx-0">
    <span class="text-sm font-medium text-gray-600">Filtro Rápido:</span>

    <button
      v-for="tag in tags"
      :key="tag.name"
      :class="[
        'text-xs font-semibold px-3 py-1 rounded-full transition duration-150',
        `bg-${tag.color}-100 text-${tag.color}-600 hover:bg-${tag.color}-200`,
        activeTag === tag.name && `ring-2 ring-${tag.color}-500 ring-offset-1 shadow-md`
      ]"
      @click="selectTag(tag.name)"
    >
      #{{ tag.name }}
    </button>

    <!-- Botão de Limpar Filtro -->
    <button
      v-if="activeTag"
      class="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition duration-150"
      @click="emit('selectTag', '')"
    >
      ✕ Limpar
    </button>
  </div>
</template>
