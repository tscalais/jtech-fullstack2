import { defineStore } from 'pinia';
import { useLocalStorage } from '@/composables/useLocalStorage';
import type { Tarefa } from '@/types';
//import { v4 as uuidv4 } from 'uuid';

const getNextId = (items: Tarefa[]): number => {
  const ids = items.map((item) => item.id)
  const maxId = ids.length > 0 ? Math.max(...ids) : 0
  return maxId + 1
}

type TarefasPorListaId = { [listaId: string]: Tarefa[] };
const tarefas: import('vue').Ref<TarefasPorListaId> = useLocalStorage('jtech-tasks', {});

export const useTarefasStore = defineStore('tarefas', {
  state: () => ({
    tarefas: tarefas.value
  }),
  actions: {
    adicionarTarefa(listaId: number, titulo: string) {
      if (!this.tarefas[listaId]) {
        this.tarefas[listaId] = [];
      }
      const novaTarefa: Tarefa = {
        id: getNextId(this.tarefas[listaId]),
        listaId,
        titulo,
        concluida: false,
        criadaEm: Date.now(),
      }
      this.tarefas[listaId].push(novaTarefa);
    },
    excluirTarefa(listaId: number, tarefaId: number) {
      if (this.tarefas[listaId]) {
        this.tarefas[listaId] = this.tarefas[listaId].filter(tarefa => tarefa.id !== tarefaId);
      }
    },
    alternarTarefa(listaId: number, tarefaId: number) {
      const tarefa = this.tarefas[listaId]?.find(tarefa => tarefa.id === tarefaId);
      if (tarefa) {
        tarefa.concluida = !tarefa.concluida;
      }
    },
    editarTarefa(listaId: number, tarefaId: number, novoTitulo: string) {
        const tarefa = this.tarefas[listaId]?.find(tarefa => tarefa.id === tarefaId);
        if (tarefa) {
            tarefa.titulo = novoTitulo;
        }
    },
    excluirTarefasPorListaId(listaId: number) {
        delete this.tarefas[listaId];
    }
  }
});
