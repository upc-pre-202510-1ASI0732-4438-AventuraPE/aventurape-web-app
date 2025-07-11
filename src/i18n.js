import { createI18n } from 'vue-i18n'

// Importar archivos de traducción
import es from './locales/es.json'
import en from './locales/en.json'

// Función para detectar el idioma del navegador
function getDefaultLocale() {
  // Primero verificar si hay un idioma guardado en localStorage
  const savedLocale = localStorage.getItem('aventurape-locale')
  if (savedLocale && ['es', 'en'].includes(savedLocale)) {
    return savedLocale
  }

  // Si no hay idioma guardado, detectar del navegador
  const browserLocale = navigator.language.toLowerCase()

  // Verificar si el idioma del navegador es uno de los soportados
  if (browserLocale.startsWith('en')) {
    return 'en'
  }

  // Fallback a español por defecto
  return 'es'
}

// Crear instancia de i18n
const i18n = createI18n({
  locale: getDefaultLocale(),
  fallbackLocale: 'es',
  messages: {
    es,
    en
  },
  legacy: false, // Usar Composition API
  globalInjection: true
})

// Función para cambiar idioma y guardarlo en localStorage
export function setLocale(locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('aventurape-locale', locale)
}

export default i18n
