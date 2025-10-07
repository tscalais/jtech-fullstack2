export interface Folder {
  id: number;
  name: string;
  ownerId?: string;
  ownerUsername?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  favorite: boolean;
  folder: Folder;
}

export interface Subtask {
  id: number;
  taskId: number;
  name: string;
  concluida: boolean;
  createdAt: number;
}
