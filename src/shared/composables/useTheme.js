import { ref, onMounted, watch } from 'vue'

const isDarkMode = ref(false)

export function useTheme() {
  const initializeTheme = () => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      isDarkMode.value = storedTheme === 'dark'
    } else {
      isDarkMode.value = false // Default to light mode
    }
    applyTheme()
  }

  const applyTheme = () => {
    const html = document.documentElement
    const body = document.body
    const app = document.getElementById('app')

    if (isDarkMode.value) {
      html.classList.add('dark-theme')
      html.classList.remove('light-theme')
      body.classList.add('dark-theme')
      body.classList.remove('light-theme')
      if (app) {
        app.classList.add('dark-theme')
        app.classList.remove('light-theme')
      }
    } else {
      html.classList.add('light-theme')
      html.classList.remove('dark-theme')
      body.classList.add('light-theme')
      body.classList.remove('dark-theme')
      if (app) {
        app.classList.add('light-theme')
        app.classList.remove('dark-theme')
      }
    }
  }

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
    applyTheme()
  }

  // Watch for changes in isDarkMode and apply theme
  watch(isDarkMode, applyTheme)

  onMounted(() => {
    initializeTheme()
  })

  return {
    isDarkMode,
    toggleTheme,
    initializeTheme
  }
}
