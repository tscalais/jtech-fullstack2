import api from './api'
import type { AuthRequest, AuthResponse, UserRequest, UserDTO } from '@/types'

export async function login(data: AuthRequest): Promise<AuthResponse> {
  const { data: response } = await api.post('/auth/login', data)
  return response
}

export async function register(data: UserRequest): Promise<UserDTO> {
  const { data: response } = await api.post('/auth/register', data)
  return response
}

export async function resetPassword(data: AuthRequest): Promise<void> {
  await api.post('/auth/reset-password', data)
}

