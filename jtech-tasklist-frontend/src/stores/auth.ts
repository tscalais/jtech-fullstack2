import { defineStore } from 'pinia'
import { useLocalStorage } from '@/composables/useLocalStorage'

interface Usuario {
  nomeUsuario: string
}

const usuarioArmazenado = useLocalStorage('auth-user', null as Usuario | null)

export const useAutenticacaoStore = defineStore('autenticacao', {
  state: () => ({
    usuario: usuarioArmazenado,
  }),
  getters: {
    autenticado: (state) => !!state.usuario,
  },
  actions: {
    entrar(nomeUsuario: string, senha: string) {
      // Simulação de autenticação: verifica se o nomeUsuario e senha estão preenchidos e são iguais
      if (nomeUsuario && senha && nomeUsuario === senha) {
        this.usuario = { nomeUsuario: nomeUsuario }
        return true
      }
      this.usuario = null
      return false
    },
    sair() {
      this.usuario = null
      // Limpa o localStorage removendo o usuário salvo
      localStorage.removeItem('auth-user')
    },
  },
})
