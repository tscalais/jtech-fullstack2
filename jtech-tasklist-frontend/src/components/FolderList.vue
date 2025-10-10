<template>
  <component :is="containerComponent" v-bind="containerProps">
    <slot name="trigger"></slot>
    <div class="p-4 w-full overflow-x-hidden"> <!-- Adicionado w-full e overflow-x-hidden -->
      <div v-if="folders.length">
        <ListView
          :items="folders"
          :itemComponent="FolderListItem"
          :itemProp="'folder'"
          :itemProps="{ activeFolderId }"
          :itemListeners="{ select: onSelectFolder }"
        />
      </div>
      <div v-else class="text-center text-gray-500 dark:text-gray-400 py-8">
        Nenhuma pasta encontrada
      </div>
    </div>
    <div v-if="showActions" class="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50 dark:divide-white/10 dark:bg-gray-700/50">
      <button @click="onCreateFolder" class="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700/50 w-full">
        <svg class="size-5 flex-none text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Adicionar pasta
      </button>
      <div></div>
    </div>
    <slot name="footer"></slot>
  </component>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import ListView from './common/ListView.vue';
import FolderListItem from './FolderListItem.vue';

const props = defineProps({
  folders: { type: Array, required: true },
  activeFolderId: { type: Number, default: null },
  containerComponent: { type: [String, Object], default: 'div' },
  containerProps: { type: Object, default: () => ({}) },
  showActions: { type: Boolean, default: true },
});
const emit = defineEmits(['select', 'create-folder']);

function onSelectFolder(id: number) {
  emit('select', id);
}
function onCreateFolder() {
  emit('create-folder');
}
</script>
