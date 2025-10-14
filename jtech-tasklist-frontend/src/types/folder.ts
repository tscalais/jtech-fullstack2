export interface FolderResponse {
  id: number;
  name: string;
  ownerId: string;
  ownerUsername: string;
  createdAt: string;
  updatedAt: string;
  count: number;
}

export interface FolderRequest {
  name: string;
}

export interface FolderEntity {
  id: number;
  name: string;
  owner: import('./auth').UserEntity;
  createdAt: string;
  updatedAt: string;
}
