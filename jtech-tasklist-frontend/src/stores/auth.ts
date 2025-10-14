import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister, validateToken as apiValidateToken, getCurrentUser, type AuthRequest, type AuthResponse, type UserRequest, type UserDTO } from '@/lib/api/client'
import {
  saveToken,
  saveUser,
  getToken,
  getUser,
  clearAuthData,
  isTokenExpired
} from '@/utils/storage'

export const useAuthStore = defineStore('auth', () => {
  // ========== State ==========
  const user = ref<UserDTO | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ========== Getters ==========
  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value && !isTokenExpired(token.value)
  })

  // ========== Actions ==========

  /**
   * Inicializa a store com dados do localStorage
   */
  function initialize() {
    const storedToken = getToken()
    const storedUser = getUser<UserDTO>()

    if (storedToken && storedUser && !isTokenExpired(storedToken)) {
      token.value = storedToken
      user.value = storedUser
    } else {
      clearAuthData()
      token.value = null
      user.value = null
    }
  }

  /**
   * Faz login do usuário
   */
  async function login(data: AuthRequest): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiLogin(data)
      token.value = response.token
      saveToken(response.token)

      // Opcional: buscar dados do usuário logado, se necessário
      // user.value = ...
    } catch (err: any) {
      error.value = err.message || 'Erro ao fazer login'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Registra um novo usuário
   */
  async function register(data: UserRequest): Promise<UserDTO> {
    isLoading.value = true
    error.value = null

    try {
      const userData = await apiRegister(data)
      user.value = userData
      saveUser(userData)
      return userData
    } catch (err: any) {
      error.value = err.message || 'Erro ao registrar usuário'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Valida o token de acesso
   */
  async function validate(): Promise<void> {
    if (!token.value) return

    try {
      await apiValidateToken(token.value)
    } catch (err: any) {
      logout()
    }
  }

  /**
   * Busca o usuário atual autenticado
   */
  async function fetchCurrentUser() {
    isLoading.value = true
    error.value = null
    try {
      const userData = await getCurrentUser(token.value!)
      user.value = userData
      saveUser(userData)
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar usuário'
      user.value = null
      clearAuthData()
      token.value = null
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Faz logout do usuário
   */
  function logout(): void {
    clearAuthData()
    token.value = null
    user.value = null
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,

    // Getters
    isAuthenticated,

    // Actions
    initialize,
    login,
    register,
    validate,
    fetchCurrentUser,
    logout
  }
})
