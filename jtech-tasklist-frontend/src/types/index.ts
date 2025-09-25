export interface Task {
  id: number;
  listId: number;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface List {
  id: number;
  name: string;
  createdAt: number;
}
