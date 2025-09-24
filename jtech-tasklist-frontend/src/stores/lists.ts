import { defineStore } from 'pinia';
import { useLocalStorage } from '@/composables/useLocalStorage';
import type { List } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const lists: import('vue').Ref<List[]> = useLocalStorage('jtech-lists', []);

export const useListsStore = defineStore('lists', {
  state: () => ({
    lists: lists.value,
    activeListId: lists.value.length > 0 ? lists.value[0].id : ''
  }),
  actions: {
    createList(name: string) {
      const newList: List = {
        id: uuidv4(),
        name,
        createdAt: Date.now()
      };
      this.lists.push(newList);
      // O `useLocalStorage` fará o trabalho de salvar.
      if (!this.activeListId) {
        this.activeListId = newList.id;
      }
    },
    deleteList(id: string) {
      this.lists = this.lists.filter(list => list.id !== id);
      // Lógica para mudar a lista ativa se a atual for excluída
      if (this.activeListId === id && this.lists.length > 0) {
        this.activeListId = this.lists[0].id;
      } else if (this.lists.length === 0) {
        this.activeListId = '';
      }
    },
    renameList(id: string, newName: string) {
      const list = this.lists.find(l => l.id === id);
      if (list) {
        list.name = newName;
      }
    },
    setActiveList(id: string) {
      this.activeListId = id;
    }
  }
});
