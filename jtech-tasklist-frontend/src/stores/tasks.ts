import { defineStore } from 'pinia';
import { useLocalStorage } from '@/composables/useLocalStorage';
import type { Task } from '@/types';
//import { v4 as uuidv4 } from 'uuid';

const getNextId = (items: Task[]): number => {
  const ids = items.map((item) => item.id)
  const maxId = ids.length > 0 ? Math.max(...ids) : 0
  return maxId + 1
}

type TasksByListId = { [listId: string]: Task[] };
const tasks: import('vue').Ref<TasksByListId> = useLocalStorage('jtech-tasks', {});

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: tasks.value
  }),
  actions: {
    addTask(listId: number, title: string) {
      if (!this.tasks[listId]) {
        this.tasks[listId] = [];
      }
      const newTask: Task = {
        id: getNextId(this.tasks[listId]),
        listId,
        title,
        completed: false,
        createdAt: Date.now(),
      }
      this.tasks[listId].push(newTask);
    },
    deleteTask(listId: number, taskId: number) {
      if (this.tasks[listId]) {
        this.tasks[listId] = this.tasks[listId].filter(task => task.id !== taskId);
      }
    },
    toggleTask(listId: number, taskId: number) {
      const task = this.tasks[listId]?.find(task => task.id === taskId);
      if (task) {
        task.completed = !task.completed;
      }
    },
    editTask(listId: number, taskId: number, newTitle: string) {
        const task = this.tasks[listId]?.find(task => task.id === taskId);
        if (task) {
            task.title = newTitle;
        }
    },
    deleteTasksByListId(listId: number) {
        delete this.tasks[listId];
    }
  }
});
