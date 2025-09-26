<template>
  <v-card class="pa-4">
    <v-card-title>Listas </v-card-title>
    <div class="list-scroll-container mb-4">
      <v-list dense nav>
        <div>
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
                append-inner-icon="mdi-check"
                dense
                hide-details
                single-line
                @blur="descartarRenomeacao"
                @keyup.esc="descartarRenomeacao"
                @keyup.enter="salvarRenomeacao"
                @click:append-inner="salvarRenomeacao"
              >
              </v-text-field>

              {{ lista.nome }}
            </v-list-item-title>
            <template v-if="lista.id === idListaAtiva && !estaEditando" #append>
              <span size="small" data-testid="excluir-lista" @click.stop="$emit('excluir:lista', lista.id)">
                <v-icon color="red">mdi-delete-circle</v-icon>
              </span>
              <span size="small" data-testid="editar-lista" @click.stop="iniciarRenomeacao(lista.nome)">
                <v-icon color="blue">mdi-pencil-circle</v-icon>
              </span>
            </template>
          </v-list-item>
        </div>
      </v-list>
    </div>

    <v-form @submit.prevent="criarLista">
      <v-text-field
        v-model="tituloListaNova"
        :error="!!erroLista"
        :error-messages="erroLista"
        append-inner-icon="mdi-plus"
        density="compact"
        label="Nova Lista"
        required
        @input="erroLista = ''"
        @click:append-inner="criarLista"
      ></v-text-field>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import type { Lista } from '@/types'
import { defineEmits, defineProps, ref } from 'vue'

const { listas, idListaAtiva } = defineProps<{
  listas: Lista[]
  idListaAtiva: number
}>()

const emits = defineEmits([
  'atualizar:listaAtiva',
  'adicionar:lista',
  'excluir:lista',
  'renomear:lista',
])
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
    erroLista.value = ''
    emits('adicionar:lista', tituloListaNova.value.trim())
    tituloListaNova.value = ''
  }
}

const mostrarErroLista = (mensagem: string) => {
  erroLista.value = mensagem
}

// Expor função para componente pai
defineExpose({
  mostrarErroLista,
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
