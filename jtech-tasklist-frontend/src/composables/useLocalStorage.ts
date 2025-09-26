import { ref, watch } from 'vue'

export function useLocalStorage(key, initialValue) {
  const storedValue = localStorage.getItem(key)
  const value = ref(storedValue ? JSON.parse(storedValue) : initialValue)

  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true },
  )

  return value
}
