<template>
  <div
    class="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <UserPlusIcon class="mx-auto h-10 w-auto text-green-600 dark:text-green-400" />

      <h2
        class="mt-10 mb-8 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Tarefas - Registro
      </h2>
      <p class="text-center text-base text-gray-600 dark:text-gray-300 mb-6">
        Crie sua conta para começar a organizar suas tarefas!
      </p>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="fazerRegistro" autocomplete="off" class="flex flex-col gap-y-6">
        <div>
          <label
            for="usuario"
            class="block text-sm/6 font-medium text-gray-900 dark:text-gray-100 mb-2"
            >Usuário</label
          >
          <div class="relative">
            <UserIcon
              class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              id="usuario"
              v-model="nomeUsuario"
              type="text"
              required
              :disabled="auth.loading"
              name="usuario"
              class="block w-full rounded-md bg-white px-3 py-2 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-green-500"
              placeholder="Digite seu usuário"
            />
          </div>
        </div>
        <div>
          <label
            for="senha"
            class="block text-sm/6 font-medium text-gray-900 dark:text-gray-100 mb-2"
            >Senha</label
          >
          <div class="relative">
            <LockClosedIcon
              class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              id="senha"
              v-model="senha"
              type="password"
              required
              :disabled="auth.loading"
              name="senha"
              class="block w-full rounded-md bg-white px-3 py-2 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-green-500"
              placeholder="Digite sua senha"
            />
          </div>
        </div>
        <div>
          <label
            for="confirmarSenha"
            class="block text-sm/6 font-medium text-gray-900 dark:text-gray-100 mb-2"
            >Confirmar Senha</label
          >
          <div class="relative">
            <LockClosedIcon
              class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              id="confirmarSenha"
              v-model="confirmarSenha"
              type="password"
              required
              :disabled="auth.loading"
              name="confirmarSenha"
              class="block w-full rounded-md bg-white px-3 py-2 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-green-500"
              placeholder="Confirme sua senha"
            />
          </div>
        </div>
        <div class="mt-6 mb-2">
          <button
            type="submit"
            :disabled="auth.loading"
            class="flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 dark:bg-green-500 dark:shadow-none dark:hover:bg-green-400 dark:focus-visible:outline-green-500 disabled:opacity-60"
          >
            Registrar
          </button>
        </div>
      </form>
      <p class="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
        Já tem uma conta?
        <RouterLink
          to="/login"
          class="font-semibold text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
          >Entrar</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAutenticacaoStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'
import { UserIcon, LockClosedIcon, UserPlusIcon } from '@heroicons/vue/24/outline'

const nomeUsuario = ref('')
const senha = ref('')
const confirmarSenha = ref('')
const router = useRouter()
const auth = useAutenticacaoStore()
const tentouRegistrar = ref(false)

onMounted(() => {
  auth.erro = ''
  tentouRegistrar.value = false
})

async function fazerRegistro() {
  tentouRegistrar.value = true
  auth.erro = ''
  if (!nomeUsuario.value) {
    toast.error('Usuário é obrigatório', {
      autoClose: 4000,
      position: 'top-center',
      theme:
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
    })
    return
  }
  if (!senha.value) {
    toast.error('Senha é obrigatória', {
      autoClose: 4000,
      position: 'top-center',
      theme:
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
    })
    return
  }
  if (!confirmarSenha.value) {
    toast.error('Confirmação obrigatória', {
      autoClose: 4000,
      position: 'top-center',
      theme:
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
    })
    return
  }
  if (senha.value !== confirmarSenha.value) {
    toast.error('As senhas não coincidem', {
      autoClose: 4000,
      position: 'top-center',
      theme:
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
    })
    return
  }
  const sucesso = await auth.registrar(nomeUsuario.value, senha.value)
  if (sucesso) {
    router.push('/')
  } else if (auth.erro) {
    toast.error(auth.erro, {
      autoClose: 4000,
      position: 'top-center',
      theme:
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
    })
  }
}
</script>

<style scoped></style>
