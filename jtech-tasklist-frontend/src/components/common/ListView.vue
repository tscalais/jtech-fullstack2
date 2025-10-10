<template>
  <div>
    <slot name="header"></slot>
    <div class="grid gap-4">
      <component
        v-for="item in items"
        :is="itemComponent"
        :key="getItemKey(item)"
        v-bind="{ [itemProp]: item, ...itemProps }"
        v-on="itemListeners"
      />
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  items: { type: Array, required: true },
  itemComponent: { type: [Object, String], required: true },
  itemProp: { type: String, default: 'item' },
  itemKey: { type: String, default: 'id' },
  itemProps: { type: Object, default: () => ({}) },
  itemListeners: { type: Object, default: () => ({}) },
});

function getItemKey(item: any) {
  return props.itemKey && item && item[props.itemKey] !== undefined ? item[props.itemKey] : item?.id;
}
</script>

<style scoped>
.grid {
  display: grid;
  gap: 1rem;
}
</style>
