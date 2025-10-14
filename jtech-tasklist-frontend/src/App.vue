<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const authStore = useAuthStore()

// ========== Lifecycle ==========

onMounted(() => {
  // Qualquer inicialização global pode ir aqui
  console.log('App montado')
})

// ========== Watchers ==========

// Atualiza o título da página quando a rota muda
watch(
  () => route.meta.title,
  (title) => {
    if (title) {
      document.title = title as string
    }
  },
  { immediate: true }
)
</script>

<template>
  <div id="app" class="h-screen overflow-hidden">
    <!-- RouterView com transições -->
    <RouterView v-slot="{ Component, route }">
      <Transition
        :name="route.meta.transition as string || 'fade'"
        mode="out-in"
      >
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
    <!-- Loading Global (opcional) -->
    <Transition name="fade">
      <div
        v-if="authStore.isLoading"
        class="fixed inset-0 bg-black bg-opacity-30 z-[9999] flex items-center justify-center"
      >
        <div class="bg-white rounded-xl p-6 shadow-2xl flex flex-col items-center space-y-4">
          <div class="spinner w-12 h-12"></div>
          <p class="text-gray-700 font-medium">Carregando...</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ========== Transições de Rota ========== */

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Slide Up Transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* Scale Transition */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from {
  transform: scale(0.95);
  opacity: 0;
}

.scale-leave-to {
  transform: scale(1.05);
  opacity: 0;
}
</style>

<style>
/* ========== Estilos Globais Adicionais ========== */

/* Garante que o app ocupe toda a altura */
#app {
  min-height: 100vh;
  min-height: 100dvh; /* Para mobile */
}

/* Remove outline padrão e adiciona um personalizado */
*:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* Animação de skeleton loading */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(
    to right,
    #f3f4f6 0%,
    #e5e7eb 20%,
    #f3f4f6 40%,
    #f3f4f6 100%
  );
  background-size: 1000px 100%;
}

/* Melhorias de acessibilidade */
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 0;
  background: #6366f1;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-to-content:focus {
  top: 0;
}

/* Desabilita animações se usuário preferir */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode (preparação para futuro) */
@media (prefers-color-scheme: dark) {
  /* Você pode adicionar estilos dark mode aqui se quiser */
}

/* Print styles */
@media print {
  .no-print,
  header,
  footer,
  nav,
  aside {
    display: none !important;
  }
}

/* Selection color */
::selection {
  background-color: #6366f1;
  color: white;
}

::-moz-selection {
  background-color: #6366f1;
  color: white;
}
</style>
