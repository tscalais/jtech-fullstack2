<template>
  <v-app>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';

import { VApp, VMain } from 'vuetify/components';
</script>

<style>
</style>
