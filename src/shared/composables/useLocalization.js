import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

export function useLocalization() {
  const { t, locale } = useI18n()

  const currentLanguage = computed(() => locale.value)
  
  const availableLanguages = [
    {
      code: 'es',
      name: 'Español',
      flag: '🇪🇸'
    },
    {
      code: 'en',
      name: 'English',
      flag: '🇺🇸'
    }
  ]

  const changeLanguage = (langCode) => {
    locale.value = langCode
    localStorage.setItem('aventurape-locale', langCode)
    
    // Update document language
    document.documentElement.lang = langCode
    
    // Dispatch custom event for components that need to react to language changes
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: langCode } }))
  }

  const formatCurrency = (amount, currency = 'PEN') => {
    const formatter = new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
    return formatter.format(amount)
  }

  const formatDate = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    const formatter = new Intl.DateTimeFormat(locale.value, { ...defaultOptions, ...options })
    return formatter.format(new Date(date))
  }

  const formatTime = (date, options = {}) => {
    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit'
    }
    const formatter = new Intl.DateTimeFormat(locale.value, { ...defaultOptions, ...options })
    return formatter.format(new Date(date))
  }

  return {
    t,
    currentLanguage,
    availableLanguages,
    changeLanguage,
    formatCurrency,
    formatDate,
    formatTime
  }
}
