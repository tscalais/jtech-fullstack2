<script lang="ts" setup>
import { useAutenticacaoStore } from '@/stores/auth'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

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
  }
}
</script>

<template>
  <v-container class="d-flex align-center justify-center login-bg" fluid>
    <v-card class="pa-8" width="500">
      <v-card-title class="text-h4 text-center">Tarefas - Login</v-card-title>
      <v-card-text>
        <v-alert
          v-if="erroLogin"
          class="mb-4"
          closable
          type="warning"
          variant="tonal"
          @click:close="erroLogin = ''"
        >
          <span>{{ erroLogin }}</span>
        </v-alert>

        <v-form @submit.prevent="fazerLogin">
          <v-text-field
            v-model="form.nomeUsuario"
            :error="!!erroLogin"
            :rules="[(v) => !!v || 'Usuário é obrigatório']"
            label="Usuário"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.senha"
            :error="!!erroLogin"
            :rules="[(v) => !!v || 'Senha é obrigatória']"
            autocomplete="new-password"
            label="Senha"
            required
            type="password"
          ></v-text-field>
          <v-btn block class="mt-4" color="primary" type="submit"> Entrar </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
