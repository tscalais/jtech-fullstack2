import type { FolderEntity } from './folder'

export interface TagEntity {
  id: number;
  name: string;
  folder: FolderEntity;
}

export type TagColor = 'primary' | 'yellow' | 'indigo' | 'green' | 'red' | 'gray' | 'blue' | 'purple' | 'pink'

export interface Tag {
  id: number;
  name: string;
  color?: TagColor;
}
