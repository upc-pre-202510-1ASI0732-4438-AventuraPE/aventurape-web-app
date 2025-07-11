import { ref, onMounted, watch } from 'vue'

const isDarkMode = ref(false)

export function useTheme() {
  const initializeTheme = () => {
    const storedTheme = localStorage.getItem('aventurape-theme')
    if (storedTheme) {
      isDarkMode.value = storedTheme === 'dark'
    } else {
      // Detectar preferencia del sistema
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        isDarkMode.value = true
      } else {
        isDarkMode.value = false
      }
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
      
      // Apply theme color meta tag for mobile browsers
      let themeColorMeta = document.querySelector('meta[name="theme-color"]')
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta')
        themeColorMeta.name = 'theme-color'
        document.head.appendChild(themeColorMeta)
      }
      themeColorMeta.content = '#1a1a1a'
    } else {
      html.classList.add('light-theme')
      html.classList.remove('dark-theme')
      body.classList.add('light-theme')
      body.classList.remove('dark-theme')
      if (app) {
        app.classList.add('light-theme')
        app.classList.remove('dark-theme')
      }
      
      // Apply theme color meta tag for mobile browsers
      let themeColorMeta = document.querySelector('meta[name="theme-color"]')
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta')
        themeColorMeta.name = 'theme-color'
        document.head.appendChild(themeColorMeta)
      }
      themeColorMeta.content = '#f8f5f0'
    }
  }

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('aventurape-theme', isDarkMode.value ? 'dark' : 'light')
    applyTheme()
  }

  // Watch for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = (e) => {
    if (!localStorage.getItem('aventurape-theme')) {
      isDarkMode.value = e.matches
      applyTheme()
    }
  }

  mediaQuery.addEventListener('change', handleSystemThemeChange)

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
