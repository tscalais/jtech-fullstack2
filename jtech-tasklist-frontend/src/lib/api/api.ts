import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { getActivePinia } from 'pinia'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.41:8080',
})

api.interceptors.request.use((config) => {
  if (config.url?.startsWith('/auth')) {
    return config
  }
  let token: string | null = ''
  if (getActivePinia()) {
    try {
      const store = useAuthStore()
      token = store.token
    } catch {}
  }
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export default api

