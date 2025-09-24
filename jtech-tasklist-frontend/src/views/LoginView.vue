<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = () => {
  const success = authStore.login(form.username, form.password)
  if (success) {
    router.push('/') // Redireciona para a dashboard
  } else {
    alert('Usuário ou senha inválidos.')
  }
}
</script>

<template>
  <v-container fill-height fluid class="d-flex align-center justify-center">
    <v-card class="pa-8" width="400">
      <v-card-title class="text-h4 text-center">Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleLogin">
          <v-text-field label="Usuário" v-model="form.username" required
            :rules="[v => !!v || 'Usuário é obrigatório']"></v-text-field>
          <v-text-field label="Senha" v-model="form.password" type="password" required
            :rules="[v => !!v || 'Senha é obrigatória']"></v-text-field>
          <v-btn type="submit" color="primary" block class="mt-4">
            Entrar
          </v-btn>
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
