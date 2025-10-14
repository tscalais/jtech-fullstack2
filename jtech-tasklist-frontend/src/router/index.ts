import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getToken, isTokenExpired } from '@/utils/storage'

// ========== Definição de Rotas ==========

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Login - TaskList'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Cadastro - TaskList'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard - TaskList'
    }
  },/*
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Perfil - TaskList'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Configurações - TaskList'
    }
  },
  {
    path: '/folders/create',
    name: 'CreateFolder',
    component: () => import('@/views/CreateFolderView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Criar Pasta - TaskList'
    }
  },
  {
    path: '/folders/:id',
    name: 'FolderDetails',
    component: () => import('@/views/FolderDetailsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Detalhes da Pasta - TaskList'
    }
  },
  {
    path: '/tasks/:id',
    name: 'TaskDetails',
    component: () => import('@/views/TaskDetailsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Detalhes da Tarefa - TaskList'
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPasswordView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Recuperar Senha - TaskList'
    }
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: () => import('@/views/ResetPasswordView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Redefinir Senha - TaskList'
    }
  },*/
  // Rota 404 - Not Found
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Página não encontrada - TaskList'
    }
  }
]

// ========== Criação do Router ==========

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// ========== Navigation Guards ==========

/**
 * Guard Global - Verifica autenticação antes de cada rota
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const token = getToken()

  // Atualiza o título da página
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // Rota requer autenticação
  if (requiresAuth) {
    if (!token) {
      // Não tem token, redireciona para login
      next({
        name: 'Login',
        query: { redirect: to.fullPath } // Salva a rota de destino para redirecionar após login
      })
      return
    }

    // Verifica se o token está expirado
    if (isTokenExpired(token)) {
      console.warn('Token expirado, tentando refresh...')

      try {
        // Tenta fazer refresh do token
        await authStore.refreshAccessToken()
        next()
      } catch (error) {
        console.error('Erro ao fazer refresh do token:', error)

        // Faz logout e redireciona para login
        authStore.logout()
        next({
          name: 'Login',
          query: { redirect: to.fullPath, expired: 'true' }
        })
      }
      return
    }

    // Se não tem usuário carregado na store, tenta carregar
    if (!authStore.user) {
      try {
        await authStore.fetchCurrentUser()
        next()
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        authStore.logout()
        next({
          name: 'Login',
          query: { redirect: to.fullPath }
        })
      }
      return
    }

    // Tudo OK, permite acesso
    next()
    return
  }

  // Rota não requer autenticação
  // Se está autenticado e tenta acessar login/register, redireciona para dashboard
  if ((to.name === 'Login' || to.name === 'Register') && token && !isTokenExpired(token)) {
    next({ name: 'Dashboard' })
    return
  }

  // Permite acesso
  next()
})

/**
 * Guard Global - Após cada navegação
 */
router.afterEach((to, from) => {
  // Aqui você pode adicionar analytics, logs, etc
  console.log(`Navegou de ${from.path} para ${to.path}`)
})

// ========== Error Handler ==========

router.onError((error) => {
  console.error('Erro de roteamento:', error)
})

export default router

// ========== Tipos para meta fields ==========

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    title?: string
    roles?: string[] // Para futuras implementações de RBAC
    transition?: string // Nome da transição a ser usada
  }
}
