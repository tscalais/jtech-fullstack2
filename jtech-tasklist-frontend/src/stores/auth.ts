import { defineStore } from 'pinia'
import { useLocalStorage } from '@/composables/useLocalStorage'

interface User {
  username: string
}

const storedUser = useLocalStorage('auth-user', null as User | null)

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: storedUser,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    login(username, password) {
      // Simulação de autenticação: apenas verifica se o username e password são iguais
      if (username && password && username === password) {
        this.user = { username: username }
        return true
      }
      this.user = null
      return false
    },
    logout() {
      this.user = null
    },
  },
})
