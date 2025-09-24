<template>
  <v-card class="pa-4">
    <v-list dense>
      <v-list-item
        v-for="list in lists"
        :key="list.id"
        :active="list.id === activeListId"
        @click="$emit('update:activeList', list.id)"
      >
        <v-list-item-title>{{ list.name }}</v-list-item-title>
        <template #append>
          <v-btn icon size="small" @click.stop="$emit('deleteList', list.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
    <v-btn block color="primary" @click="$emit('addList', 'Nova Lista')">Adicionar Lista</v-btn>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { List } from '@/types';

const { lists, activeListId } = defineProps<{
  lists: List[];
  activeListId: string;
}>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits(['update:activeList', 'addList', 'deleteList']);
</script>
