export interface Task {
  id: string;
  listId: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface List {
  id: string;
  name: string;
  createdAt: number;
}
