// Tipos de autenticação e usuário alinhados à nova API OpenAPI 3.1.0

export interface AuthRequest {
  userName: string
  password: string
}

export interface AuthResponse {
  token: string
  user: UserDTO
}

export interface UserRequest {
  userName: string
  password: string
  fullName: string
  criarExemplo: true
}

export interface UserDTO {
  id: string
  userName: string
  password: string
  fullName: string
}

export interface UserEntity {
  id: string
  userName: string
  password: string
  fullName: string
}
