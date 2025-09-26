<template>
  <v-card class="pa-4">
    <v-card-title>Listas </v-card-title>
    <div class="list-scroll-container mb-4">
      <v-list dense nav>
        <v-list-item
          v-for="lista in listas"
          :key="lista.id"
          :active="lista.id === idListaAtiva"
          @click="$emit('atualizar:listaAtiva', lista.id)"
        >
          <v-list-item-title>
            <v-text-field
              v-if="estaEditando && lista.id === idListaAtiva"
              ref="nameInput"
              v-model="tituloListaEdicao"
              @blur="descartarRenomeacao"
              @keyup.enter="salvarRenomeacao"
              @keyup.esc="descartarRenomeacao"
              dense
              single-line
              hide-details
            >
            </v-text-field>
            <span v-else>
              {{ lista.nome }}
            </span>
          </v-list-item-title>
          <template #append v-if="lista.id === idListaAtiva && !estaEditando">
            <span size="small" @click.stop="$emit('excluir:lista', lista.id)">
              <v-icon color="red">mdi-delete-circle</v-icon>
            </span>
            <span size="small" @click.stop="iniciarRenomeacao(lista.nome)">
              <v-icon color="blue">mdi-pencil-circle</v-icon>
            </span>
          </template>
        </v-list-item>
      </v-list>
    </div>

    <v-form @submit.prevent="criarLista">
      <v-text-field
        v-model="tituloListaNova"
        label="Nova Lista"
        density="compact"
        append-inner-icon="mdi-plus"
        @click:append-inner="criarLista"
        @input="erroLista = ''"
        :error="!!erroLista"
        :error-messages="erroLista"
        required
      ></v-text-field>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import type { Lista } from '@/types'

const { listas, idListaAtiva } = defineProps<{
  listas: Lista[]
  idListaAtiva: number
}>()

const emits = defineEmits(['atualizar:listaAtiva', 'adicionar:lista', 'excluir:lista', 'renomear:lista'])
const tituloListaNova = ref('')
const tituloListaEdicao = ref('')
const estaEditando = ref(false)
const erroLista = ref('')

const iniciarRenomeacao = (nomeLista: string) => {
  tituloListaEdicao.value = nomeLista
  estaEditando.value = true
}

const criarLista = () => {
  if (tituloListaNova.value.trim()) {
    erroLista.value = '' // Limpar erro anterior
    emits('adicionar:lista', tituloListaNova.value.trim())
    tituloListaNova.value = ''
  }
}

// Função para mostrar erro
const mostrarErroLista = (mensagem: string) => {
  erroLista.value = mensagem
}

// Expor função para componente pai
defineExpose({
  mostrarErroLista
})

const salvarRenomeacao = () => {
  if (tituloListaEdicao.value.trim() !== '') {
    emits('renomear:lista', tituloListaEdicao.value.trim())
  }
  estaEditando.value = false
}

const descartarRenomeacao = () => {
  estaEditando.value = false
}
</script>

<style scoped>
.list-scroll-container {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
