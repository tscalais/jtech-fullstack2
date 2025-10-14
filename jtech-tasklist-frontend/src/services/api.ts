import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import { toast } from 'vue3-toastify'

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// Cria instância do axios
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de Request - Adiciona o token JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    const token = authStore.token

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Interceptor de Response - Trata erros globalmente
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Erro 401 - Token expirado ou inválido
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const authStore = useAuthStore()

      // Tenta fazer refresh do token
      if (authStore.refreshToken) {
        try {
          await authStore.refreshAccessToken()

          // Retentar a requisição original com o novo token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${authStore.token}`
          }
          return api(originalRequest)
        } catch (refreshError) {
          // Se o refresh falhar, desloga o usuário
          authStore.logout()
          router.push('/login')
          return Promise.reject(refreshError)
        }
      } else {
        // Não tem refresh token, desloga
        authStore.logout()
        router.push('/login')
      }
    }

    // Erro 403 - Sem permissão
    if (error.response?.status === 403) {
      console.error('Acesso negado:', error.response.data)
      toast.error('Acesso negado: você não tem permissão para este recurso.')
    }

    // Erro 404 - Recurso não encontrado
    if (error.response?.status === 404) {
      console.error('Recurso não encontrado:', error.response.data)
    }

    // Erro 500 - Erro do servidor
    if (error.response?.status === 500) {
      console.error('Erro no servidor:', error.response.data)
      toast.error('Erro no servidor: por favor, tente novamente mais tarde.')
    }

    return Promise.reject(error)
  },
)

// Helper para extrair mensagem de erro
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Erro desconhecido'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Erro desconhecido'
}

// Tipos de resposta padrão da API
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}
