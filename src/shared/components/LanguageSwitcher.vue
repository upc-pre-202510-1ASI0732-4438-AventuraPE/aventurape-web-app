<template>
  <div class="language-switcher" ref="switcher">
    <button
      @click="toggleDropdown"
      class="language-button"
      :class="{ 'active': isOpen }"
    >
      <i class="pi pi-globe"></i>
      <span class="current-language">{{ currentLanguage.toUpperCase() }}</span>
      <i class="pi pi-chevron-down arrow" :class="{ 'rotated': isOpen }"></i>
    </button>

    <transition name="dropdown">
      <div v-if="isOpen" class="language-dropdown">
        <button
          v-for="lang in availableLanguages"
          :key="lang.code"
          @click="changeLanguage(lang.code)"
          class="language-option"
          :class="{ 'selected': currentLanguage === lang.code }"
        >
          <img :src="lang.flag" :alt="lang.name" class="flag-icon">
          <span>{{ lang.name }}</span>
          <i v-if="currentLanguage === lang.code" class="pi pi-check"></i>
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '../../i18n'

export default {
  name: 'LanguageSwitcher',
  setup() {
    const { locale } = useI18n()
    const isOpen = ref(false)
    const switcher = ref(null)

    const availableLanguages = [
      {
        code: 'es',
        name: 'Español',
        flag: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAyNCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE4IiBmaWxsPSIjQUEwMDIyIi8+CjxyZWN0IHk9IjYiIHdpZHRoPSIyNCIgaGVpZ2h0PSI2IiBmaWxsPSIjRkZEQTAwIi8+Cjwvc3ZnPgo='
      },
      {
        code: 'en',
        name: 'English',
        flag: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAyNCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE4IiBmaWxsPSIjMDA1MkI0Ii8+CjxyZWN0IHk9IjIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyIiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHk9IjYiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyIiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHk9IjEwIiB3aWR0aD0iMjQiIGhlaWdodD0iMiIgZmlsbD0iI0ZGRkZGRiIvPgo8cmVjdCB5PSIxNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjIiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+Cg=='
      }
    ]

    const currentLanguage = computed(() => locale.value)

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }

    const changeLanguage = (langCode) => {
      setLocale(langCode)
      isOpen.value = false
    }

    const handleClickOutside = (event) => {
      if (switcher.value && !switcher.value.contains(event.target)) {
        isOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      isOpen,
      switcher,
      availableLanguages,
      currentLanguage,
      toggleDropdown,
      changeLanguage
    }
  }
}
</script>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.language-button:hover,
.language-button.active {
  background: #f5f5f5;
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.current-language {
  font-weight: 600;
  min-width: 20px;
}

.arrow {
  transition: transform 0.3s ease;
  font-size: 12px;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 140px;
  overflow: hidden;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
  color: #333;
}

.language-option:hover {
  background: #f8f9fa;
}

.language-option.selected {
  background: #e3f2fd;
  color: #007bff;
  font-weight: 600;
}

.flag-icon {
  width: 20px;
  height: 15px;
  border-radius: 2px;
  object-fit: cover;
}

/* Animaciones del dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
  transform-origin: top;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.9);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.9);
}

/* Responsive */
@media (max-width: 768px) {
  .language-button {
    padding: 6px 10px;
    font-size: 13px;
  }

  .language-dropdown {
    right: 0;
    min-width: 120px;
  }

  .language-option {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
