

export interface Subtask {
  id: number;
  description: string;
  completed: boolean;
  parentTask?: Task;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  favorite: boolean;
  folder: { id: number; name: string };
  subtasks: Subtask[];
  tags: Tag[];
}

export type TaskEntity = Task;
