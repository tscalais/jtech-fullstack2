<template>
  <v-app>
    <!-- Barra de navegação superior -->
    <v-app-bar v-if="autenticacaoStore.autenticado" color="primary" dark>
      <v-app-bar-title> Lista de Tarefas </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Menu do usuário -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-account-circle" size="large" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title class="text-subtitle-2">
              Olá, {{ autenticacaoStore.usuario?.nomeUsuario }}!
            </v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item prepend-icon="mdi-logout" @click="fazerLogout">
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
<script lang="ts" setup>
import { useAutenticacaoStore } from '@/stores/auth'
import { RouterView, useRouter } from 'vue-router'

import {
  VApp,
  VAppBar,
  VAppBarTitle,
  VBtn,
  VDivider,
  VList,
  VListItem,
  VListItemTitle,
  VMain,
  VMenu,
  VSpacer,
} from 'vuetify/components'

const autenticacaoStore = useAutenticacaoStore()
const router = useRouter()

const fazerLogout = () => {
  autenticacaoStore.sair()
  router.push('/login')
}
</script>

<style>
/* Nenhum estilo global necessário, tudo via Tailwind */
</style>
