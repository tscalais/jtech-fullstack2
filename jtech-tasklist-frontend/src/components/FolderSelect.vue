<template>
  <FolderList
    :folders="folders"
    :activeFolderId="activeFolderId"
    :containerComponent="'div'"
    :showActions="true"
    @select="onSelectFolder"
    @create-folder="openCreateFolderDialog"
  />
</template>

<script setup lang="ts">
import { useFoldersStore } from '@/stores/folders.ts'
import { defineProps, defineEmits } from 'vue';
import FolderList from './FolderList.vue';

const foldersStore = useFoldersStore()

const props = defineProps({
  folders: { type: Array, required: true },
  activeFolderId: { type: Number, default: null },
});

const emit = defineEmits(['select', 'create-folder']);

function onSelectFolder(id: number) {
  foldersStore.setActiveFolderId(props.folder.id)
  emit('select', id);
}
function openCreateFolderDialog() {
  emit('create-folder');
}
</script>
