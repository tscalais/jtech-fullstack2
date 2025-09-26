// Configuração global para testes com Vuetify
import { config } from '@vue/test-utils'
import vuetify from '@/plugins/vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// Registra o plugin globalmente para todos os mounts
config.global.plugins = [vuetify]

// Polyfill básico para matchMedia exigido por alguns componentes Vuetify
if (!window.matchMedia) {
  // @ts-ignore
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}
