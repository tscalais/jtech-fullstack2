import { onMounted, onBeforeUnmount, type Ref } from 'vue'

/**
 * Composable para detectar cliques fora de um elemento
 * @param elementRef - Ref do elemento HTML
 * @param callback - Função a ser executada quando clicar fora
 */
export function useClickOutside(
  elementRef: Ref<HTMLElement | null>,
  callback: () => void
) {
  const handleClick = (event: MouseEvent) => {
    const target = event.target as Node

    if (elementRef.value && !elementRef.value.contains(target)) {
      callback()
    }
  }

  onMounted(() => {
    document.addEventListener('mousedown', handleClick)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClick)
  })

  return {
    // Você pode retornar métodos adicionais se necessário
  }
}
