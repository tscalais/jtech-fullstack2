<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const countdown = ref(5)
const isRedirecting = ref(false)

let interval: number | null = null

onMounted(() => {
  // Inicia contagem regressiva para redirecionar
  interval = window.setInterval(() => {
    countdown.value--

    if (countdown.value <= 0) {
      redirectToHome()
    }
  }, 1000)
})

const redirectToHome = () => {
  if (interval) clearInterval(interval)
  isRedirecting.value = true

  setTimeout(() => {
    router.push('/dashboard')
  }, 500)
}

const goBack = () => {
  if (interval) clearInterval(interval)
  router.back()
}

const goToHome = () => {
  if (interval) clearInterval(interval)
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-4 py-12">

    <div class="max-w-2xl w-full text-center">

      <!-- Ilustração 404 -->
      <div class="mb-8 relative">
        <!-- Número 404 animado -->
        <div class="text-9xl md:text-[12rem] font-bold text-gray-300 select-none animate-pulse-custom">
          404
        </div>

        <!-- Ícone flutuante -->
        <i class="fa-solid fa-face-frown w-24 h-24 md:w-32 md:h-32 text-primary-500" />
      </div>

      <!-- Mensagens -->
      <div class="space-y-4 mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900">
          Página não encontrada
        </h1>
        <p class="text-lg text-gray-600 max-w-md mx-auto">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>

        <!-- Contagem regressiva -->
        <div
          v-if="!isRedirecting"
          class="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium"
        >
          <i class="fa-solid fa-clock w-4 h-4" />
          <span>Redirecionando em {{ countdown }} segundo{{ countdown !== 1 ? 's' : '' }}...</span>
        </div>

        <div
          v-else
          class="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium"
        >
          <div class="spinner w-4 h-4 border-green-600"></div>
          <span>Redirecionando...</span>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          @click="goToHome"
          class="btn-primary flex items-center space-x-2 px-6 py-3"
          :disabled="isRedirecting"
        >
          <i class="fa-solid fa-home w-5 h-5" />
          <span>Ir para Home</span>
        </button>

        <button
          @click="goBack"
          class="btn-secondary flex items-center space-x-2 px-6 py-3"
          :disabled="isRedirecting"
        >
          <i class="fa-solid fa-arrow-left w-5 h-5" />
          <span>Voltar</span>
        </button>
      </div>

      <!-- Links Úteis -->
      <div class="mt-12 pt-8 border-t border-gray-300">
        <p class="text-sm text-gray-600 mb-4">Páginas úteis:</p>
        <div class="flex flex-wrap justify-center gap-4 text-sm">
          <router-link
            to="/dashboard"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            Dashboard
          </router-link>
          <span class="text-gray-400">•</span>
          <router-link
            to="/profile"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            Perfil
          </router-link>
          <span class="text-gray-400">•</span>
          <router-link
            to="/settings"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            Configurações
          </router-link>
        </div>
      </div>

      <!-- Informação adicional -->
      <div class="mt-8">
        <details class="text-left bg-white rounded-xl shadow-sm p-6 max-w-md mx-auto">
          <summary class="cursor-pointer font-medium text-gray-700 hover:text-primary-600 transition">
            Por que estou vendo esta página?
          </summary>
          <div class="mt-4 space-y-2 text-sm text-gray-600">
            <p>Esta página aparece quando:</p>
            <ul class="list-disc list-inside space-y-1 ml-2">
              <li>O link que você clicou está quebrado ou desatualizado</li>
              <li>Você digitou incorretamente o endereço URL</li>
              <li>A página foi movida ou removida</li>
              <li>Você não tem permissão para acessar este recurso</li>
            </ul>
          </div>
        </details>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Animação personalizada de pulse */
@keyframes pulse-custom {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.animate-pulse-custom {
  animation: pulse-custom 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Animação de bounce suave */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}

/* Estilos para o details/summary */
details summary::-webkit-details-marker {
  display: none;
}

details summary {
  list-style: none;
}

details summary::after {
  content: '+';
  float: right;
  font-size: 1.5rem;
  font-weight: bold;
  color: #6366f1;
  transition: transform 0.3s ease;
}

details[open] summary::after {
  transform: rotate(45deg);
}

details[open] {
  border: 2px solid #e0e7ff;
}
</style>
