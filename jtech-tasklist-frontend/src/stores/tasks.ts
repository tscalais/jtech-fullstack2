import { defineStore } from 'pinia';
import { useLocalStorage } from '@/composables/useLocalStorage';
import type { Task } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// O estado será um objeto onde as chaves são os listIds e os valores são arrays de tarefas.
type TasksByListId = { [listId: string]: Task[] };
const tasks: import('vue').Ref<TasksByListId> = useLocalStorage('jtech-tasks', {});

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: tasks.value
  }),
  actions: {
    addTask(listId: string, title: string) {
      if (!this.tasks[listId]) {
        this.tasks[listId] = [];
      }
      const newTask: Task = {
        id: uuidv4(),
        listId,
        title,
        completed: false,
        createdAt: Date.now()
      };
      this.tasks[listId].push(newTask);
    },
    deleteTask(listId: string, taskId: string) {
      if (this.tasks[listId]) {
        this.tasks[listId] = this.tasks[listId].filter(task => task.id !== taskId);
      }
    },
    toggleTask(listId: string, taskId: string) {
      const task = this.tasks[listId]?.find(task => task.id === taskId);
      if (task) {
        task.completed = !task.completed;
      }
    },
    // Adicione outras ações, como `editTask`
    editTask(listId: string, taskId: string, newTitle: string) {
        const task = this.tasks[listId]?.find(task => task.id === taskId);
        if (task) {
            task.title = newTitle;
        }
    },
    // Ação para deletar todas as tarefas de uma lista quando a lista é excluída.
    deleteTasksByListId(listId: string) {
        delete this.tasks[listId];
    }
  }
});
