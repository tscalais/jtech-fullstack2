<template>
  <v-card class="pa-4">
    <v-card-title
      >Listas
      <v-btn icon @click="handleLogout" variant="text">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-card-title>
    <div class="list-scroll-container mb-4">
      <v-list dense nav>
        <v-list-item
          v-for="list in lists"
          :key="list.id"
          :active="list.id === activeListId"
          @click="$emit('update:activeList', list.id)"
        >
          <v-list-item-title>
            <v-text-field
              v-if="isEditing && list.id === activeListId"
              ref="nameInput"
              v-model="editedListName"
              @blur="discardRename"
              @keyup.enter="saveRename"
              @keyup.esc="discardRename"
              dense
              single-line
              hide-details
            >
            </v-text-field>
            <span v-else>
              {{ list.name }}
            </span>
          </v-list-item-title>
          <template #append v-if="list.id === activeListId && !isEditing">
            <span size="small" @click.stop="$emit('deleteList', list.id)">
              <v-icon color="red">mdi-delete-circle</v-icon>
            </span>
            <span size="small" @click.stop="startRename(list.name)">
              <v-icon color="blue">mdi-pencil-circle</v-icon>
            </span>
          </template>
        </v-list-item>
      </v-list>
    </div>

    <v-form @submit.prevent="handleCreateList">
      <v-text-field
        v-model="newListTitle"
        label="Nova Lista"
        density="compact"
        append-inner-icon="mdi-plus"
        @click:append-inner="handleCreateList"
        required
      ></v-text-field>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import type { List } from '@/types'

const { lists, activeListId } = defineProps<{
  lists: List[]
  activeListId: number
}>()

const emits = defineEmits(['update:activeList', 'addList', 'deleteList', 'renameList'])
const newListTitle = ref('')
const isEditing = ref(false)
const editedListName = ref('')

const startRename = (listName: string) => {
  editedListName.value = listName
  isEditing.value = true
}

const handleCreateList = () => {
  if (newListTitle.value.trim()) {
    emits('addList', newListTitle.value.trim())
    newListTitle.value = ''
  }
}

const saveRename = () => {
  if (editedListName.value.trim() !== '') {
    emits('renameList', editedListName.value.trim())
  }
  isEditing.value = false
}

const discardRename = () => {
  isEditing.value = false
}
</script>

<style scoped>
.list-scroll-container {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
