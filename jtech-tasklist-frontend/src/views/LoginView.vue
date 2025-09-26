<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAutenticacaoStore } from '@/stores/auth'

const autenticacaoStore = useAutenticacaoStore()
const router = useRouter()

const form = reactive({
  nomeUsuario: '',
  senha: '',
})

const erroLogin = ref('')
const tentativasLogin = ref(0)

const fazerLogin = () => {
  const sucesso = autenticacaoStore.entrar(form.nomeUsuario, form.senha)
  if (sucesso) {
    erroLogin.value = ''
    tentativasLogin.value = 0
    router.push('/tarefas') // Redireciona para o painel de tarefas
  } else {
    tentativasLogin.value++

    if (tentativasLogin.value === 1) {
      erroLogin.value = 'Usuário ou senha incorretos. 💡 Dica: Use o mesmo texto para usuário e senha.'
    } else if (tentativasLogin.value === 2) {
      erroLogin.value = 'Lembre-se: o usuário e a senha devem ser idênticos para fazer login!'
    } else {
      erroLogin.value = 'Ainda não conseguiu? 👤 Experimente: Seu Nome em usuário e senha.'
    }
  }
}
</script>

<template>
  <v-container fill-height fluid class="d-flex align-center justify-center">
    <v-card class="pa-8" width="800">
      <v-card-title class="text-h4 text-center">Login</v-card-title>
      <v-card-text>
        <v-alert
          v-if="erroLogin"
          type="warning"
          variant="tonal"
          class="mb-4"
          closable
          @click:close="erroLogin = ''"
        >
          {{ erroLogin }}
        </v-alert>

        <v-form @submit.prevent="fazerLogin">
          <v-text-field
            label="Usuário"
            v-model="form.nomeUsuario"
            required
            :rules="[(v) => !!v || 'Usuário é obrigatório']"
            :error="!!erroLogin"
          ></v-text-field>
          <v-text-field
            label="Senha"
            v-model="form.senha"
            type="password"
            required
            :rules="[(v) => !!v || 'Senha é obrigatória']"
            :error="!!erroLogin"
            autocomplete="new-password"
          ></v-text-field>
          <v-btn type="submit" color="primary" block class="mt-4"> Entrar </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: sans-serif;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
