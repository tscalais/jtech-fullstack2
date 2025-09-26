import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import PainelTarefasView from '../views/PainelTarefasView.vue'
import { useAutenticacaoStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'dashboard',
      component: PainelTarefasView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const autenticacaoStore = useAutenticacaoStore()
  if (to.meta.requiresAuth && !autenticacaoStore.autenticado) {
    // se a rota requer autenticação e o usuário não está autenticado,
    // redireciona para a página de login
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
