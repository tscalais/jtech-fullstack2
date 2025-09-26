import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginView from '../LoginView.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useAutenticacaoStore } from '@/stores/auth'

// Mock router push
const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

function mockLocalStorage() {
  const store: Record<string,string> = {}
  return {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] },
    clear: () => { Object.keys(store).forEach(k => delete store[k]) },
  }
}

describe('LoginView', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    setActivePinia(createPinia())
    // @ts-expect-error mock localStorage
    global.localStorage = mockLocalStorage()
  })

  const mountView = () =>
    mount(LoginView)

  it('mostra validação quando campos vazios e submit', async () => {
    const wrapper = mountView()
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.html()).toContain('Usuário é obrigatório')
  })

  it('falha login quando usuario!=senha', async () => {
    const wrapper = mountView()
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('alice')
    await inputs[1].setValue('bob')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toMatch(/Usuário ou senha incorretos/i)
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('login bem sucedido redireciona para /tarefas', async () => {
    const wrapper = mountView()
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('john')
    await inputs[1].setValue('john')
    await wrapper.find('form').trigger('submit.prevent')
    expect(pushMock).toHaveBeenCalledWith('/tarefas')
    const auth = useAutenticacaoStore()
    expect(auth.autenticado).toBe(true)
  })
})
