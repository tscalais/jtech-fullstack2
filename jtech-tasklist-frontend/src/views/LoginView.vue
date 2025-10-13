<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { resetPassword } from '@/lib/api/client'
import type { AuthRequest } from '@/types/auth'
import { ArrowLeftEndOnRectangleIcon, UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ExclamationTriangleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'


const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// ========== State ==========
const form = ref<AuthRequest>({
  userName: '', // alinhado com backend
  password: '',
})

const isLoading = ref(false)
const error = ref<string | null>(null)
const showPassword = ref(false)
const rememberMe = ref(false)
const forgotPasswordLoading = ref(false)

// ========== Computed ==========
const isFormValid = computed(() => {
  return form.value.userName.trim() !== '' && form.value.password.length >= 6
})

const redirectPath = computed(() => {
  return (route.query.redirect as string) || '/dashboard'
})

const sessionExpired = computed(() => {
  return route.query.expired === 'true'
})

// ========== Lifecycle ==========
onMounted(() => {
  // Se já está autenticado, redireciona
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }

  // Carrega email salvo se houver
  const savedUserName = localStorage.getItem('saved_userName')
  if (savedUserName) {
    form.value.userName = savedUserName
    rememberMe.value = true
  }

  // Mostra mensagem se a sessão expirou
  if (sessionExpired.value) {
    error.value = 'Sua sessão expirou. Por favor, faça login novamente.'
  }
})

// ========== Methods ==========
const handleSubmit = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  error.value = null

  // For test: password must always be equal to username
  form.value.password = form.value.userName

  try {
    await authStore.login(form.value)

    // Salva email se "lembrar-me" estiver marcado
    if (rememberMe.value) {
      localStorage.setItem('saved_userName', form.value.userName)
    } else {
      localStorage.removeItem('saved_userName')
    }

    // Redireciona para a página desejada
    router.push(redirectPath.value)
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err &&
      'response' in err &&
      err.response &&
      typeof err.response === 'object' &&
      'data' in err.response &&
      err.response.data &&
      typeof err.response.data === 'object' &&
      'message' in err.response.data
    ) {
      error.value = err.response.data.message as string
    } else {
      error.value = 'Usuário ou senha inválidos'
    }
  } finally {
    isLoading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const goToRegister = () => {
  router.push('/register')
}

const goToForgotPassword = async () => {
  if (!form.value.userName.trim()) {
    error.value = 'Informe o nome de usuário para redefinir a senha.'
    return
  }
  forgotPasswordLoading.value = true
  error.value = null
  try {
    await resetPassword(form.value.userName)
    error.value = null
    alert('Senha redefinida! Agora sua senha é igual ao seu nome de usuário.')
  } catch (err) {
    error.value = 'Erro ao redefinir senha. Verifique o nome de usuário.'
  } finally {
    forgotPasswordLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4 py-12">
    <!-- Login Card -->
    <div class="w-full max-w-md">
      <!-- Logo e Título -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg dark:bg-indigo-500"
        >
          <ArrowLeftEndOnRectangleIcon class="w-10 h-10 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bem-vindo ao TaskList</h1>
        <p class="text-gray-600 dark:text-gray-300">Entre com sua conta para continuar</p>
      </div>

      <!-- Card Principal -->
      <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6 dark:bg-white/5 dark:shadow-none">
        <!-- Alerta de Sessão Expirada -->
        <div
          v-if="sessionExpired"
          class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-3 dark:bg-yellow-900/20 dark:border-yellow-700"
        >
          <ExclamationTriangleIcon class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5 dark:text-yellow-400" />
          <p class="text-sm text-yellow-800 dark:text-yellow-200">
            Sua sessão expirou. Por favor, faça login novamente.
          </p>
        </div>

        <!-- Erro de Login -->
        <Transition name="slide-down">
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 dark:bg-red-900/20 dark:border-red-700"
          >
            <ExclamationCircleIcon class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5 dark:text-red-400" />
            <div class="flex-1">
              <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
            </div>
            <button
              @click="error = null"
              class="text-red-400 hover:text-red-600 dark:text-red-300 dark:hover:text-red-500"
            >
              <XMarkIcon class="w-5 h-5"/>
            </button>
          </div>
        </Transition>

        <!-- Formulário -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Usuário -->
          <div>
            <label
              for="userName"
              class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100"
            >
              Usuário
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon class="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                id="userName"
                v-model="form.userName"
                type="text"
                autocomplete="username"
                required
                placeholder="seu usuário"
                class="input-field pl-10 bg-white dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Senha -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100"
            >
              Senha
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                placeholder="••••••••"
                class="input-field pl-10 pr-10 bg-white dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                :disabled="isLoading"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5"/>
                <EyeSlashIcon v-else class="w-5 h-5"/>
              </button>
            </div>
          </div>

          <!-- Lembrar-me e Esqueci a senha -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-white/10 dark:border-gray-600"
                :disabled="isLoading"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-200">
                Lembrar-me
              </label>
            </div>

            <button
              type="button"
              @click="goToForgotPassword"
              class="text-sm font-medium px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              :disabled="isLoading"
            >
              Esqueceu a senha?
            </button>
          </div>

          <!-- Botão de Submit -->
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="w-full flex items-center justify-center space-x-2 py-3 text-base rounded-md bg-indigo-600 text-white font-semibold shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
          >
            <span v-if="!isLoading">Entrar</span>
            <span v-else class="flex items-center space-x-2">
              <div class="spinner w-5 h-5 border-white"></div>
              <span>Entrando...</span>
            </span>
          </button>
        </form>
      </div>

      <!-- Link para Registro -->
      <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Não tem uma conta?
        <button
          @click="goToRegister"
          class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          :disabled="isLoading"
        >
          Criar conta gratuita
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Animação para mensagens de erro */
.slide-down-enter-active {
  animation: slideDown 0.3s ease-out;
}

.slide-down-leave-active {
  animation: slideDown 0.3s ease-in reverse;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
