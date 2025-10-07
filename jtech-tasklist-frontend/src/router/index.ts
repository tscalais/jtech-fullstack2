import { useAutenticacaoStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import TasksDashboardWrapper from '../views/TasksDashboardWrapper.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/tarefas',
      name: 'painel-tarefas',
      component: PainelTarefasView,
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/',
      redirect: '/tarefas',
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const autenticacaoStore = useAutenticacaoStore()
  if (to.meta.requiresAuth) {
    const valido = await autenticacaoStore.validarToken(router)
    if (!valido) {
      // Redirecionamento já tratado em validarToken
      return
    }
  }
  next()
})

export default router
