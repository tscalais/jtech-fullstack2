<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12" md="4" lg="3" xl="2">
        <gerenciador-lista
          :listas="listasStore.listas"
          :idListaAtiva="listasStore.listaAtivaId"
          @atualizar:listaAtiva="listasStore.definirListaAtiva"
          @adicionar:lista="adicionarLista"
          @excluir:lista="confirmarExclusaoLista"
          @renomear:lista="renomearLista"
        >
        </gerenciador-lista>
      </v-col>

      <v-col cols="12" md="8" lg="9" xl="10">
        <gerenciador-tarefas
          v-if="listasStore.listaAtivaId"
          :tarefas="tarefasAtivas"
          @adicionar:tarefa="adicionarTarefa"
          @alternar:tarefa="alternarTarefa"
          @excluir:tarefa="excluirTarefa"
        >
        </gerenciador-tarefas>
        <v-alert v-else type="info"> Selecione uma lista ou crie uma nova. </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
//import { useRouter } from 'vue-router';

// Meus Componentes
import GerenciadorLista from '@/components/GerenciadorLista.vue'
import GerenciadorTarefas from '@/components/GerenciadorTarefas.vue'

// Componentes do Vuetify necessários para esta view
import { VContainer, VRow, VCol, VAlert } from 'vuetify/components'

// Stores
import { useAutenticacaoStore } from '@/stores/auth'
import { useListasStore } from '@/stores/lists'
import { useTarefasStore } from '@/stores/tasks'

const autenticacaoStore = useAutenticacaoStore()
const listasStore = useListasStore()
const tarefasStore = useTarefasStore()
//const router = useRouter();

onMounted(() => {
  if (listasStore.listas.length === 0 && autenticacaoStore.autenticado) {
    listasStore.criarLista('Tarefas Principais')
  }
})

const tarefasAtivas = computed(() => {
  if (!listasStore.listaAtivaId) return []
  return tarefasStore.tarefas[listasStore.listaAtivaId] || []
})

const adicionarLista = (nomeList: string) => {
  listasStore.criarLista(nomeList)
}

// Função simples usando confirm nativo do browser
const confirmarExclusaoLista = (listaId: number) => {
  const lista = listasStore.listas.find(l => l.id === listaId)
  if (!lista) return

  const quantidadeTarefas = tarefasStore.tarefas[listaId]?.length || 0

  const message = quantidadeTarefas > 0
    ? `Tem certeza que deseja excluir a lista "${lista.nome}"?\n\nEsta ação também excluirá ${quantidadeTarefas} tarefa${quantidadeTarefas > 1 ? 's' : ''} associada${quantidadeTarefas > 1 ? 's' : ''} a esta lista.\n\nEsta ação não pode ser desfeita.`
    : `Tem certeza que deseja excluir a lista "${lista.nome}"?\n\nEsta lista não possui tarefas.\n\nEsta ação não pode ser desfeita.`

  if (confirm(message)) {
    listasStore.excluirLista(listaId)
    tarefasStore.excluirTarefasPorListaId(listaId)
  }
}

const renomearLista = (novoNome: string) => {
  if (listasStore.listaAtivaId) {
    listasStore.renomearLista(listasStore.listaAtivaId, novoNome)
  }
}

const alternarTarefa = (tarefaId: number) => {
  tarefasStore.alternarTarefa(listasStore.listaAtivaId, tarefaId)
}

const excluirTarefa = (tarefaId: number) => {
  tarefasStore.excluirTarefa(listasStore.listaAtivaId, tarefaId)
}

const adicionarTarefa = (tituloTarefa: string) => {
  if (listasStore.listaAtivaId) {
    tarefasStore.adicionarTarefa(listasStore.listaAtivaId, tituloTarefa)
  }
}
</script>
