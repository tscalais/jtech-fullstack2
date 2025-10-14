import type { FolderEntity } from './folder'

// Tag e Subtask auxiliares (se ainda usados em UI)
export type TagColor = 'primary' | 'yellow' | 'indigo' | 'green' | 'red' | 'gray' | 'blue' | 'purple' | 'pink'
export interface Tag {
  name: string
  color: TagColor
}

export interface Subtask {
  id: number;
  description: string;
  completed: boolean;
  task: Task;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  favorite: boolean;
  folder: FolderEntity;
  subtasks: Subtask[];
  tags: Tag[];
}

export interface TaskStatus {
  completed: boolean;
}
