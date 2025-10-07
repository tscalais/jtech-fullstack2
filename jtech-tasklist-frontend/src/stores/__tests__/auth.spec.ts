import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAutenticacaoStore } from '../auth'
import api from '@/lib/api/client'

vi.mock('@/lib/api/client')

// Helper para tipar corretamente o mock do api.post
const mockApiPost = api.post as unknown as ReturnType<typeof vi.fn>

describe('AuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('faz login com sucesso e armazena token e usuário', async () => {
    const mockToken = 'mocked-token'
    mockApiPost.mockResolvedValueOnce({ data: { token: mockToken } })
    const store = useAutenticacaoStore()
    const result = await store.entrar('usuario', 'senha')
    expect(result).toBe(true)
    expect(store.token).toBe(mockToken)
    expect(store.usuario).toEqual({ nomeUsuario: 'usuario', token: mockToken })
    const userStr = localStorage.getItem('auth-user')
    expect(userStr).not.toBeNull()
    expect(JSON.parse(userStr!)).toEqual({ nomeUsuario: 'usuario', token: mockToken })
  })

  it('trata erro de login', async () => {
    mockApiPost.mockRejectedValueOnce({ response: { data: { message: 'Credenciais inválidas' } } })
    const store = useAutenticacaoStore()
    const result = await store.entrar('usuario', 'senha')
    expect(result).toBe(false)
    expect(store.token).toBe('')
    expect(store.usuario).toBeNull()
    expect(store.erro).toBe('Credenciais inválidas')
  })

  it('faz registro e login automático', async () => {
    mockApiPost.mockResolvedValueOnce({}) // register
    mockApiPost.mockResolvedValueOnce({ data: { token: 'token-reg' } }) // login
    const store = useAutenticacaoStore()
    const result = await store.registrar('novo', 'senha')
    expect(result).toBe(true)
    expect(store.token).toBe('token-reg')
    expect(store.usuario).toEqual({ nomeUsuario: 'novo', token: 'token-reg' })
  })

  it('trata erro de registro', async () => {
    mockApiPost.mockRejectedValueOnce({ response: { data: { message: 'Usuário já existe' } } })
    const store = useAutenticacaoStore()
    const result = await store.registrar('existe', 'senha')
    expect(result).toBe(false)
    expect(store.token).toBe('')
    expect(store.usuario).toBeNull()
    expect(store.erro).toBe('Usuário já existe')
  })

  it('faz logout limpando token e usuário', () => {
    const store = useAutenticacaoStore()
    store.usuario = { nomeUsuario: 'u', token: 'tok' }
    localStorage.setItem('auth-user', JSON.stringify(store.usuario))
    store.sair()
    expect(store.token).toBe('')
    expect(store.usuario).toBeNull()
    expect(localStorage.getItem('auth-user')).toBeNull()
  })
})
