// Tipos alinhados com a nova API OpenAPI 3.1.0

export interface UserDTO {
  id: string;
  userName: string;
  password: string;
  fullName: string;
}

export interface AuthRequest {
  userName: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserRequest {
  userName: string;
  password: string;
  fullName: string;
}
