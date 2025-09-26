<template>
  <v-container class="pa-4" fluid>
    <v-row>
      <v-col cols="12" lg="3" md="4" xl="2">
        <gerenciador-lista
          ref="gerenciadorListaRef"
          :idListaAtiva="listasStore.listaAtivaId"
          :listas="listasStore.listas"
          @atualizar:listaAtiva="listasStore.definirListaAtiva"
          @adicionar:lista="adicionarLista"
          @excluir:lista="confirmarExclusaoLista"
          @renomear:lista="renomearLista"
        />
      </v-col>

      <v-col cols="12" lg="9" md="8" xl="10">
        <gerenciador-tarefas
          v-if="listasStore.listaAtivaId"
          ref="gerenciadorTarefasRef"
          :tarefas="tarefasAtivas"
          @adicionar:tarefa="adicionarTarefa"
          @alternar:tarefa="alternarTarefa"
          @excluir:tarefa="excluirTarefa"
        />
        <v-alert v-else type="info"> Selecione uma lista ou crie uma nova. </v-alert>
      </v-col>
    </v-row>
    <v-dialog v-model="loading" content-class="loader-dialog-center" max-width="80" persistent>
      <v-card
        class="pa-6 d-flex flex-column align-center justify-center"
        color="transparent"
        elevation="0"
        style="box-shadow: none; background: transparent"
      >
        <v-progress-circular color="primary" indeterminate size="56" />
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import GerenciadorLista from '@/components/GerenciadorLista.vue'
import GerenciadorTarefas from '@/components/GerenciadorTarefas.vue'

import { useAutenticacaoStore } from '@/stores/auth'
import { useListasStore } from '@/stores/lists'
import { useTarefasStore } from '@/stores/tasks'
import { computed, onMounted, ref, watch } from 'vue'

import { VAlert, VCol, VContainer, VRow } from 'vuetify/components'

const autenticacaoStore = useAutenticacaoStore()
const listasStore = useListasStore()
const tarefasStore = useTarefasStore()

const gerenciadorListaRef = ref<InstanceType<typeof GerenciadorLista> | null>(null)
const gerenciadorTarefasRef = ref<InstanceType<typeof GerenciadorTarefas> | null>(null)

const loading = ref(false)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
  timeout: 2500,
})

function showSnackbar(message: string, color: string = 'success', timeout = 2500) {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.timeout = timeout
  snackbar.value.show = true
}

watch(
  () => listasStore.listaAtivaId,
  async () => {
    loading.value = true
    gerenciadorTarefasRef.value?.mostrarErroTarefa('')
    await new Promise((resolve) => setTimeout(resolve, 500))
    loading.value = false
  },
)

onMounted(() => {
  if (listasStore.listas.length === 0 && autenticacaoStore.autenticado) {
    setTimeout(() => {
      const message =
        'Você ainda não tem nenhuma lista de tarefas. Deseja criar uma lista de exemplo?'
      if (confirm(message)) {
        listasStore.criarLista('Casa')
        tarefasStore.adicionarTarefa(listasStore.listas[0].id, 'Comprar mantimentos')
        tarefasStore.adicionarTarefa(listasStore.listas[0].id, 'Limpar a casa')
        tarefasStore.adicionarTarefa(listasStore.listas[0].id, 'Pagar contas')
      }
    }, 250)
  }
})

const tarefasAtivas = computed(() => {
  if (!listasStore.listaAtivaId) {
    return []
  }
  return tarefasStore.tarefas[listasStore.listaAtivaId] || []
})

const adicionarLista = async (nomeList: string) => {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 300))
  try {
    listasStore.criarLista(nomeList)
    showSnackbar('Lista criada com sucesso!', 'success')
  } catch (error) {
    gerenciadorListaRef.value?.mostrarErroLista((error as Error).message)
    //showSnackbar((error as Error).message, 'error')
  } finally {
    loading.value = false
  }
}

const confirmarExclusaoLista = async (listaId: number) => {
  const lista = listasStore.listas.find((l) => l.id === listaId)
  if (!lista) return
  const quantidadeTarefas = tarefasStore.tarefas[listaId]?.length || 0

  const message =
    quantidadeTarefas > 0
      ? `Tem certeza que deseja excluir a lista "${lista.nome}"?\n\nEsta ação também excluirá ${quantidadeTarefas} tarefa${quantidadeTarefas > 1 ? 's' : ''} associada${quantidadeTarefas > 1 ? 's' : ''} a esta lista.\n\nEsta ação não pode ser desfeita.`
      : `Tem certeza que deseja excluir a lista "${lista.nome}"?\n\nEsta lista não possui tarefas.\n\nEsta ação não pode ser desfeita.`

  if (confirm(message)) {
    loading.value = true
    await new Promise((resolve) => setTimeout(resolve, 300))
    listasStore.excluirLista(listaId)
    tarefasStore.excluirTarefasPorListaId(listaId)
    showSnackbar('Lista excluída com sucesso!', 'success')
    loading.value = false
  }
}

const renomearLista = async (novoNome: string) => {
  if (listasStore.listaAtivaId) {
    loading.value = true
    await new Promise((resolve) => setTimeout(resolve, 300))
    try {
      listasStore.renomearLista(listasStore.listaAtivaId, novoNome)
      showSnackbar('Lista renomeada com sucesso!', 'success')
    } catch (error) {
      gerenciadorListaRef.value?.mostrarErroLista((error as Error).message)
      //showSnackbar((error as Error).message, 'error')
    } finally {
      loading.value = false
    }
  }
}

const alternarTarefa = async (tarefaId: number) => {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 300))

  const tarefa = tarefasStore.alternarTarefa(listasStore.listaAtivaId, tarefaId)
  if (tarefa && tarefa.concluida) {
    showSnackbar('Tarefa concluída!', 'success')
  } else {
    showSnackbar('Tarefa reaberta!', 'info')
  }

  loading.value = false
}

const excluirTarefa = async (tarefaId: number) => {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 300))
  tarefasStore.excluirTarefa(listasStore.listaAtivaId, tarefaId)
  showSnackbar('Tarefa excluída!', 'success')
  loading.value = false
}

const adicionarTarefa = async (tituloTarefa: string) => {
  if (listasStore.listaAtivaId) {
    loading.value = true

    try {
      tarefasStore.adicionarTarefa(listasStore.listaAtivaId, tituloTarefa)
      showSnackbar('Tarefa adicionada com sucesso!', 'success')
    } catch (error) {
      gerenciadorTarefasRef.value?.mostrarErroTarefa((error as Error).message)
      //showSnackbar((error as Error).message, 'error')
    } finally {
      loading.value = false
    }
  }
}
</script>
<style scoped>
.loader-dialog-center .v-overlay__content {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 100vh !important;
  min-width: 100vw !important;
  overflow: hidden !important;
}
</style>
