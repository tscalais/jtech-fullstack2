import api from './api'
import type { UserDTO } from '@/types'

export async function validateToken(token: string): Promise<void> {
  await api.get('/users/validate', { headers: { Authorization: `Bearer ${token}` } })
}

export async function getCurrentUser(token: string): Promise<UserDTO> {
  const { data } = await api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
  return data
}

export async function getAllUsers(): Promise<UserDTO[]> {
  const { data } = await api.get('/users')
  return data
}

export async function getUserByUsername(username: string): Promise<UserDTO> {
  const { data } = await api.get(`/users/${username}`)
  return data
}

export async function getUserProfile(id: number): Promise<UserDTO> {
  const { data } = await api.get(`/users/profile/${id}`)
  return data
}
