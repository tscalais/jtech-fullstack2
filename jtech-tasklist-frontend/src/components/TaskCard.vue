<template>
  <div :class="wrapperClass">
    <div :class="bgClass" />
    <div :class="contentClass">
      <div :class="contentPaddingClass">
        <p :class="titleClass">
          <span v-if="isFavorite">
            <svg class="w-7 h-7 text-yellow-300 inline-block mr-2 align-middle" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.77l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78z"/></svg>
          </span>
          {{ task.title }}
        </p>
        <p :class="descClass">{{ task.description || 'Sem descrição.' }}</p>
      </div>
      <div class="flex items-center gap-2 mt-2 px-8" :class="isFavorite ? 'mb-2' : ''">
        <input type="checkbox" :checked="task.completed" @change="$emit('toggle-completed', task)" />
        <span :class="isFavorite ? 'text-xs text-white' : 'text-gray-400 text-xs dark:text-gray-400'">Concluída</span>
      </div>
      <div class="flex gap-2 mt-2 px-8 pb-4">
        <button @click="$emit('edit', task)" v-if="editTaskId !== task.id" :class="isFavorite ? 'text-white/80 text-xs underline' : 'text-blue-400 text-xs underline dark:text-blue-300'">Editar</button>
        <button v-else @click="$emit('cancel-edit')" :class="isFavorite ? 'text-white/60 text-xs underline' : 'text-gray-400 text-xs underline dark:text-gray-400'">Cancelar</button>
        <button @click="$emit('delete', task)" :class="isFavorite ? 'text-red-200 text-xs underline' : 'text-red-400 text-xs underline dark:text-red-300'">Excluir</button>
        <button @click="$emit('toggle-favorite', task)" :title="task.favorite ? 'Desfavoritar' : 'Favoritar'" :class="isFavorite ? 'text-yellow-200 text-xs underline' : 'text-yellow-400 text-xs underline dark:text-yellow-300'">
          <svg v-if="task.favorite" class="w-5 h-5 inline" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.77l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78z"/></svg>
          <svg v-else class="w-5 h-5 inline opacity-50" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v12m0 0l3.5 3.5M12 15l-3.5 3.5"/></svg>
        </button>
      </div>
      <div v-if="editTaskId === task.id" class="w-full mt-2 px-8 pb-4">
        <input :value="editTitle" @input="$emit('update:editTitle', ($event.target as HTMLInputElement)?.value)" @keyup.enter="$emit('save-edit', task)" @blur="$emit('save-edit', task)" class="border rounded px-2 py-1 text-sm w-full mt-2 text-gray-800 dark:text-gray-100 dark:bg-gray-900" />
      </div>
    </div>
    <div :class="outlineClass" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { Task } from '@/types'

const props = defineProps<{
  task: Task,
  isFavorite?: boolean,
  editTaskId: number | null,
  editTitle: string
}>()

const wrapperClass = computed(() => {
  if (props.isFavorite) {
    return 'relative lg:row-span-2'
  }
  return 'relative'
})
const bgClass = computed(() => {
  if (props.isFavorite) {
    return 'absolute inset-px rounded-lg bg-white lg:rounded-l-4xl dark:bg-gray-800'
  }
  return 'absolute inset-px rounded-lg bg-white dark:bg-gray-800'
})
const contentClass = computed(() => {
  if (props.isFavorite) {
    return 'relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]'
  }
  return 'relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]'
})
const contentPaddingClass = computed(() => {
  if (props.isFavorite) {
    return 'px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0'
  }
  return 'px-8 pt-8 sm:px-10 sm:pt-10'
})
const titleClass = computed(() => {
  if (props.isFavorite) {
    return 'mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white'
  }
  return 'mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white'
})
const descClass = computed(() => {
  if (props.isFavorite) {
    return 'mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400'
  }
  return 'mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400'
})
const outlineClass = computed(() => {
  if (props.isFavorite) {
    return 'pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-l-4xl dark:outline-white/15'
  }
  return 'pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 dark:outline-white/15'
})
</script>

<style scoped>
:root {
  --radius-lg: 1rem;
}
</style>
