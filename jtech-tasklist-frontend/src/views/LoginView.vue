<script lang="ts" setup>
import {
  ArrowLeftEndOnRectangleIcon,
  UserIcon,
  LockClosedIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline'
import { useAutenticacaoStore } from '@/stores/auth'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const autenticacaoStore = useAutenticacaoStore()
const router = useRouter()

const form = reactive({
  nomeUsuario: '',
  senha: '',
})

const erroLogin = ref('')
const tentativasLogin = ref(0)

const fazerLogin = async () => {
  const sucesso = await autenticacaoStore.entrar(form.nomeUsuario, form.senha)
  if (sucesso) {
    erroLogin.value = ''
    tentativasLogin.value = 0
    router.push('/tarefas')
  } else {
    tentativasLogin.value++
    let mensagem = ''
    if (tentativasLogin.value === 1) {
      mensagem = 'Usuário ou senha incorretos. Tente novamente.'
    } else if (tentativasLogin.value === 2) {
      mensagem = 'Verifique se digitou corretamente seu usuário e senha.'
    } else {
      mensagem = 'Se esqueceu sua senha, procure o administrador do sistema.'
    }
    erroLogin.value = mensagem
    toast.error(mensagem, { autoClose: 4000, position: 'top-center' })
  }
}
</script>

<template>
  <div
    class="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-br from-indigo-50 to-indigo-200 dark:from-gray-900 dark:to-gray-800"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <ArrowLeftEndOnRectangleIcon class="mx-auto h-10 w-auto text-indigo-600" />

      <h2 class="mt-10 mb-8 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
        Tarefas - Login
      </h2>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="fazerLogin" autocomplete="off" class="flex flex-col gap-y-6">
        <div class="">
          <label for="usuario" class="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
            Usuário
          </label>
          <div class="relative">
            <UserIcon
              class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              id="usuario"
              v-model="form.nomeUsuario"
              type="text"
              required
              autofocus
              name="usuario"
              class="block w-full rounded-md bg-white px-3 py-1.5 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="senha" class="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
              Senha
            </label>
          </div>
          <div class="relative">
            <LockClosedIcon
              class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              id="senha"
              v-model="form.senha"
              type="password"
              required
              autocomplete="current-password"
              class="block w-full rounded-md bg-white px-3 py-1.5 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
            />
          </div>
        </div>

        <div class="mt-6 mb-2">
          <button
            type="submit"
            :disabled="!form.nomeUsuario || !form.senha"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
          >
            Entrar
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
        Not a member?
        <RouterLink
          to="/register"
          class="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >Registre-se</RouterLink
        >
      </p>
    </div>
  </div>
</template>
