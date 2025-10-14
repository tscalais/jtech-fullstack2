// Tipos alinhados com a nova API OpenAPI 3.1.0

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
  owner: UserEntity;
  createdAt: string;
  updatedAt: string;
}

export interface UserEntity {
  id: string;
  userName: string;
  password: string;
  fullName: string;
}
