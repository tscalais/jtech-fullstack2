<template>
  <div
    class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
    :class="activeClass"
    @click="onClick"
  >
    <div
      class="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-gray-700/50 dark:group-hover:bg-gray-700"
    >
      <svg
        class="size-6 text-gray-600 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
        />
      </svg>
    </div>
    <div class="flex-auto">
      <span class="block font-semibold text-gray-900 dark:text-white">{{ folder.name }}</span>
      <p class="mt-1 text-gray-600 dark:text-gray-400" v-if="showOwner">
        {{ folder.ownerUsername }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { useAutenticacaoStore } from '@/stores/auth'
import { useFoldersStore } from '@/stores/folders'
const props = defineProps({
  folder: { type: Object, required: true },
  active: { type: Boolean, default: false },
})
const emit = defineEmits(['select'])
const onClick = () => {
  foldersStore.setActiveFolderId(props.folder.id)
  emit('select', props.folder.id)
}
const activeClass = props.active ? 'ring-2 ring-indigo-500' : ''

const autenticacaoStore = useAutenticacaoStore()
const foldersStore = useFoldersStore()
const showOwner = computed(() => {
  return props.folder.ownerUsername && props.folder.ownerUsername !== autenticacaoStore.usuario?.nomeUsuario
})
</script>
