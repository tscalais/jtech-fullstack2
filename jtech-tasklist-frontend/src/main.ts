import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Importa estilos do Tailwind
import './assets/styles/tailwind.css'

// Importa a store de auth para inicialização
import { useAuthStore } from './stores/auth'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faLock, faHome, faClock, faArrowLeft, faFaceFrown, faUserPlus, faEye, faEyeSlash, faCheckCircle, faMagnifyingGlass, faBell, faChevronDown, faUserCircle, faCog, faArrowRightFromBracket, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

library.add(
  faUser, faLock, faHome, faClock, faArrowLeft, faFaceFrown, faUserPlus, faEye, faEyeSlash, faCheckCircle, faMagnifyingGlass, faBell, faChevronDown, faUserCircle, faCog, faArrowRightFromBracket, faExclamationTriangle
)

// ========== Criação da Aplicação ==========

const app = createApp(App)

// ========== Pinia (State Management) ==========
const pinia = createPinia()
app.use(pinia)

// ========== Vue Router ==========
app.use(router)

// ========== Inicialização da Auth Store ==========
// Restaura dados de autenticação do localStorage antes de montar o app
const authStore = useAuthStore()
authStore.initialize()

// ========== Vue3 Toastify (Notificações) ==========
app.use(Vue3Toastify, {
  theme: 'colored',
  autoClose: 3000,
} as ToastContainerOptions)

// ========== Error Handler Global ==========
app.config.errorHandler = (err, instance, info) => {
  console.error('Erro global capturado:', err)
  console.error('Componente:', instance)
  console.error('Info:', info)

}

// ========== Warn Handler (apenas em desenvolvimento) ==========
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('Warning:', msg)
    console.warn('Trace:', trace)
  }
}

// ========== Performance Tracking (opcional) ==========
if (import.meta.env.DEV) {
  app.config.performance = true
}

// ========== Diretivas Globais (opcional) ==========

// Diretiva v-focus - foca automaticamente em um input
app.directive('focus', {
  mounted(el) {
    el.focus()
  },
})

// Diretiva v-click-outside (alternativa ao composable)
app.directive('click-outside', {
  mounted(el, binding) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
})

// ========== Propriedades Globais (opcional) ==========

// Exemplo: adicionar variáveis globais
app.config.globalProperties.$appName = 'TaskList'
app.config.globalProperties.$appVersion = '1.0.0'

// ========== Registro Global de Componentes (opcional) ==========

app.component('font-awesome-icon', FontAwesomeIcon)

// ========== Montagem da Aplicação ==========

app.mount('#app')

// ========== Hot Module Replacement (HMR) para Pinia ==========
if (import.meta.hot) {
  import.meta.hot.accept()
}

// ========== Service Worker (PWA - opcional) ==========
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('SW registrado:', registration)
      })
      .catch((error) => {
        console.log('Erro ao registrar SW:', error)
      })
  })
}

// ========== Tipos Globais ==========
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $appName: string
    $appVersion: string
  }
}
