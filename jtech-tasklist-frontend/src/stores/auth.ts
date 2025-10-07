import { useLocalStorage } from '@/composables/useLocalStorage'
import api from '@/lib/api/client'
import { defineStore } from 'pinia'

interface Usuario {
  nomeUsuario: string
  token?: string
}

const usuarioArmazenado = useLocalStorage('auth-user', null as Usuario | null)

export const useAutenticacaoStore = defineStore('autenticacao', {
  state: () => ({
    usuario: usuarioArmazenado,
    loading: false,
    erro: '',
  }),
  getters: {
    autenticado: (state) => !!state.usuario && !!state.usuario.token,
    token: (state) => state.usuario?.token || '',
  },
  actions: {
    async entrar(nomeUsuario: string, senha: string) {
      this.loading = true
      try {
        const response = await api.post('/auth/login', {
          userName: nomeUsuario,
          password: senha,
        })
        const token = response.data.token as string
        this.usuario = { nomeUsuario, token }
        localStorage.setItem('auth-user', JSON.stringify(this.usuario))
        return true
      } catch {
        this.usuario = null
        return false
      } finally {
        this.loading = false
      }
    },
    async registrar(nomeUsuario: string, senha: string) {
      this.loading = true
      this.erro = ''
      try {
        await api.post('/auth/register', {
          userName: nomeUsuario,
          password: senha,
        })
        // Registro bem-sucedido, já faz login automático
        return await this.entrar(nomeUsuario, senha)
      } catch (err) {
        this.usuario = null
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.erro = (err as any)?.response?.data?.message || 'Erro ao registrar.'
        return false
      } finally {
        this.loading = false
      }
    },
    sair() {
      this.usuario = null
      localStorage.removeItem('auth-user')
    },
    async validarToken(router?: any) {
      if (!this.usuario || !this.usuario.token) {
        this.sair()
        if (router) router.push({ name: 'login' })
        return false
      }
      this.loading = true
      try {
        await api.get('/auth/validate', {
          headers: {
            Authorization: `Bearer ${this.usuario.token}`,
          },
        })
        return true
      } catch (err: any) {
        if (err?.response?.status !== 200) {
          this.sair()
          if (router) router.push({ name: 'login' })
        }
        return false
      } finally {
        this.loading = false
      }
    },
  },
})
