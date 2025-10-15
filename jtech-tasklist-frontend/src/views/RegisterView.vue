<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { RegisterDto } from '@/types/auth'
import { toast } from 'vue3-toastify'

const router = useRouter()
const authStore = useAuthStore()

// ========== State ==========
const form = reactive<RegisterDto>({
  userName: '',
  fullName: '',
  password: '',
  passwordConfirmation: '',
})

const isLoading = ref(false)
const error = ref<string | null>(null)
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const acceptedTerms = ref(false)

// Validações individuais
const validations = reactive({
  userName: { valid: false, message: '' },
  fullName: { valid: false, message: '' },
  password: { valid: false, message: '' },
  passwordConfirmation: { valid: false, message: '' },
})

// ========== Computed ==========
const isFormValid = computed(() => {
  return (
    validations.userName.valid &&
    validations.fullName.valid &&
    //validations.password.valid &&
    validations.passwordConfirmation.valid &&
    acceptedTerms.value
  )
})

const passwordStrength = computed(() => {
  const password = form.password
  if (password.length === 0) return { level: 0, text: '', color: '' }

  let strength = 0

  // Critérios de força
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength <= 2) return { level: 1, text: 'Fraca', color: 'red' }
  if (strength <= 3) return { level: 2, text: 'Média', color: 'yellow' }
  if (strength <= 4) return { level: 3, text: 'Boa', color: 'blue' }
  return { level: 4, text: 'Forte', color: 'green' }
})

// ========== Watchers & Validations ==========
const validateUserName = () => {
  const userName = form.userName.trim()

  if (userName.length === 0) {
    validations.userName = { valid: false, message: '' }
    return
  }

  if (userName.length < 3) {
    validations.userName = {
      valid: false,
      message: 'Nome de usuário deve ter pelo menos 3 caracteres',
    }
    return
  }

  if (userName.length > 30) {
    validations.userName = { valid: false, message: 'Nome de usuário muito longo' }
    return
  }

  validations.userName = { valid: true, message: '' }
}

const validateFullName = () => {
  const fullName = form.fullName.trim()

  if (fullName.length === 0) {
    validations.fullName = { valid: false, message: '' }
    return
  }

  if (fullName.length < 3) {
    validations.fullName = {
      valid: false,
      message: 'Nome completo deve ter pelo menos 3 caracteres',
    }
    return
  }

  if (fullName.length > 100) {
    validations.fullName = { valid: false, message: 'Nome completo muito longo' }
    return
  }

  validations.fullName = { valid: true, message: '' }
}

const validatePassword = () => {
  const password = form.password

  if (password.length === 0) {
    validations.password = { valid: false, message: '' }
    return
  }

  if (password.length < 8) {
    validations.password = { valid: false, message: 'Senha deve ter pelo menos 8 caracteres' }
    return
  }

  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    validations.password = {
      valid: false,
      message: 'Senha deve conter letras maiúsculas e minúsculas',
    }
    return
  }

  if (!/\d/.test(password)) {
    validations.password = { valid: false, message: 'Senha deve conter pelo menos um número' }
    return
  }

  validations.password = { valid: true, message: '' }

  // Revalida a confirmação se ela já foi preenchida
  if (form.passwordConfirmation.length > 0) {
    validatePasswordConfirmation()
  }
}

const validatePasswordConfirmation = () => {
  const confirmation = form.passwordConfirmation

  if (confirmation.length === 0) {
    validations.passwordConfirmation = { valid: false, message: '' }
    return
  }

  if (confirmation !== form.password) {
    validations.passwordConfirmation = { valid: false, message: 'As senhas não coincidem' }
    return
  }

  validations.passwordConfirmation = { valid: true, message: '' }
}

// ========== Methods ==========
const handleSubmit = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  error.value = null

  try {
    await authStore.register(form)

    // Redireciona para dashboard após registro bem-sucedido
    router.push('/dashboard')
  } catch (err) {

    const errorMsg = err?.response?.data?.message || 'Erro ao criar conta. Tente novamente mais tarde.'
    toast.error(errorMsg)
    error.value = errorMsg

    // Se for erro de userName já existente

    if (err?.response?.status === 409) {
      error.value = 'Este nome de usuário já está cadastrado'
      validations.userName = { valid: false, message: error.value }
      toast.error(error.value)
    }
  } finally {
    isLoading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const togglePasswordConfirmationVisibility = () => {
  showPasswordConfirmation.value = !showPasswordConfirmation.value
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div
    class="min-h-screen h-screen overflow-auto flex justify-center bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12"
  >
    <!-- Register Card -->
    <div class="w-full max-w-md">
      <!-- Logo e Título -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4 shadow-lg dark:bg-green-500"
        >
          <i class="fa-solid fa-user-plus mx-auto h-10 w-auto text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Criar sua conta</h1>
        <p class="text-gray-600 dark:text-gray-300">Comece a organizar suas tarefas hoje mesmo</p>
      </div>

      <!-- Card Principal -->
      <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6 dark:bg-white/5 dark:shadow-none">
        <!-- Formulário -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Nome Completo -->
          <div>
            <label
              for="fullName"
              class="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2"
            >
              Nome completo
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa-solid fa-user w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                autocomplete="name"
                required
                placeholder="João Silva"
                :class="[
                  'input-field pl-10 bg-white dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500 dark:focus:outline-green-500',
                  validations.fullName.message &&
                    'border-red-300 focus:border-red-500 focus:ring-red-500',
                ]"
                :disabled="isLoading"
                @blur="validateFullName"
                @input="validateFullName"
              />
            </div>
            <p
              v-if="validations.fullName.message"
              class="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {{ validations.fullName.message }}
            </p>
          </div>

          <!-- Nome de Usuário -->
          <div>
            <label
              for="userName"
              class="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2"
            >
              Nome de usuário
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa-solid fa-user w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                id="userName"
                v-model="form.userName"
                type="text"
                autocomplete="username"
                required
                placeholder="joaosilva"
                :class="[
                  'input-field pl-10 bg-white dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500 dark:focus:outline-green-500',
                  validations.userName.message &&
                    'border-red-300 focus:border-red-500 focus:ring-red-500',
                ]"
                :disabled="isLoading"
                @blur="validateUserName"
                @input="validateUserName"
              />
            </div>
            <p
              v-if="validations.userName.message"
              class="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {{ validations.userName.message }}
            </p>
          </div>

          <!-- Senha -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2"
            >
              Senha
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa-solid fa-lock w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                placeholder="••••••••"
                :class="[
                  'input-field pl-10 pr-10 bg-white dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500 dark:focus:outline-green-500',
                  validations.password.message &&
                    'border-red-300 focus:border-red-500 focus:ring-red-500',
                ]"
                :disabled="isLoading"
                @blur="validatePassword"
                @input="validatePassword"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                :disabled="isLoading"
              >
                <i v-if="!showPassword" class="fa-solid fa-eye-slash w-5 h-5" />
                <i v-else class="fa-solid fa-eye w-5 h-5" />
              </button>
            </div>

            <!-- Indicador de força da senha -->
            <div v-if="form.password.length > 0" class="mt-2">
              <div class="flex items-center space-x-2">
                <div class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden dark:bg-gray-700">
                  <div
                    :class="[
                      'h-full transition-all duration-300',
                      `bg-${passwordStrength.color}-500`,
                    ]"
                    :style="{ width: `${(passwordStrength.level / 4) * 100}%` }"
                  ></div>
                </div>
                <span
                  :class="[
                    'text-xs font-medium',
                    `text-${passwordStrength.color}-600 dark:text-${passwordStrength.color}-400`,
                  ]"
                >
                  {{ passwordStrength.text }}
                </span>
              </div>
            </div>

            <p
              v-if="validations.password.message"
              class="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {{ validations.password.message }}
            </p>
          </div>

          <!-- Confirmação de Senha -->
          <div>
            <label
              for="password-confirmation"
              class="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2"
            >
              Confirmar senha
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa-solid fa-check-circle w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                id="password-confirmation"
                v-model="form.passwordConfirmation"
                :type="showPasswordConfirmation ? 'text' : 'password'"
                autocomplete="new-password"
                required
                placeholder="••••••••"
                :class="[
                  'input-field pl-10 pr-10 bg-white dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500 dark:focus:outline-green-500',
                  validations.passwordConfirmation.message &&
                    'border-red-300 focus:border-red-500 focus:ring-red-500',
                ]"
                :disabled="isLoading"
                @blur="validatePasswordConfirmation"
                @input="validatePasswordConfirmation"
              />
              <button
                type="button"
                @click="togglePasswordConfirmationVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                :disabled="isLoading"
              >
                <i v-if="!showPasswordConfirmation" class="fa-solid fa-eye-slash w-5 h-5" />
                <i v-else class="fa-solid fa-eye w-5 h-5" />
              </button>
            </div>
            <p
              v-if="validations.passwordConfirmation.message"
              class="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {{ validations.passwordConfirmation.message }}
            </p>
          </div>

          <!-- Termos de Uso -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="acceptedTerms"
                type="checkbox"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded dark:bg-white/10 dark:border-gray-600"
                :disabled="isLoading"
                required
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="text-gray-700 dark:text-gray-200">
                Eu aceito os
                <a
                  href="#"
                  class="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                >
                  Termos de Uso
                </a>
                e a
                <a
                  href="#"
                  class="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                >
                  Política de Privacidade
                </a>
              </label>
            </div>
          </div>

          <!-- Botão de Submit -->
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="w-full flex items-center justify-center space-x-2 py-3 text-base rounded-md bg-green-600 text-white font-semibold shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 dark:bg-green-500 dark:shadow-none dark:hover:bg-green-400 dark:focus-visible:outline-green-500 disabled:opacity-60"
          >
            <span v-if="!isLoading">Criar conta</span>
            <span v-else class="flex items-center space-x-2">
              <div class="spinner w-5 h-5 border-white"></div>
              <span>Criando conta...</span>
            </span>
          </button>
        </form>
      </div>

      <!-- Link para Login -->
      <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Já tem uma conta?
        <button
          @click="goToLogin"
          class="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
          :disabled="isLoading"
        >
          Fazer login
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

/* Cores dinâmicas para indicador de força */
.bg-red-500 {
  background-color: #ef4444;
}
.bg-yellow-500 {
  background-color: #eab308;
}
.bg-blue-500 {
  background-color: #3b82f6;
}
.bg-green-500 {
  background-color: #22c55e;
}

.text-red-600 {
  color: #dc2626;
}
.text-yellow-600 {
  color: #ca8a04;
}
.text-blue-600 {
  color: #2563eb;
}
.text-green-600 {
  color: #16a34a;
}
</style>
