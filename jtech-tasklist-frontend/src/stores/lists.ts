import { defineStore } from 'pinia';
import { useLocalStorage } from '@/composables/useLocalStorage';
import type { List } from '@/types';
//import { v4 as uuidv4 } from 'uuid';

const getNextId = (items: List[]): number => {
  const ids = items.map((item) => item.id);
  const maxId = ids.length > 0 ? Math.max(...ids) : 0
  return maxId + 1
}
const lists: import('vue').Ref<List[]> = useLocalStorage('jtech-lists', []);

export const useListsStore = defineStore('lists', {
  state: () => ({
    lists: lists.value,
    activeListId: lists.value.length > 0 ? lists.value[0].id : 0,
  }),
  actions: {
    createList(name: string) {
      const newList: List = {
        id: getNextId(this.lists),
        name,
        createdAt: Date.now(),
      }
      this.lists.push(newList)
      this.activeListId = newList.id
    },

    deleteList(id: number) {
      lists.value = lists.value.filter((list) => list.id !== id)
      this.lists = lists.value
      if (this.activeListId === id && this.lists.length > 0) {
        this.activeListId = this.lists[0].id
      } else if (this.lists.length === 0) {
        this.activeListId = 0
      }
    },
    renameList(id: number, name: string) {
      const list = this.lists.find((l) => l.id === id)
      if (list) {
        list.name = name
      }
    },
    setActiveList(id: number) {
      this.activeListId = id
    },
  },
})
