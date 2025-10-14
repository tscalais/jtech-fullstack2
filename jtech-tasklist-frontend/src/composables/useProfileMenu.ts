import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function useProfileMenu() {
  const router = useRouter()
  const authStore = useAuthStore()
  const isOpen = ref(false)

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const close = () => {
    isOpen.value = false
  }

  const goToProfile = () => {
    router.push('/profile')
    close()
  }

  const goToSettings = () => {
    router.push('/settings')
    close()
  }

  const logout = async () => {
    try {
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
    close()
  }

  return {
    isOpen,
    toggle,
    close,
    goToProfile,
    goToSettings,
    logout
  }
}
