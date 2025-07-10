<template>
  <div class="language-switcher" ref="switcher">
    <button
      @click="toggleDropdown"
      class="language-button"
      :class="{ 'active': isOpen }"
    >
      <i class="pi pi-globe"></i>
      <span class="current-language">{{ currentLanguageData?.flag }} {{ currentLanguage.toUpperCase() }}</span>
      <i class="pi pi-chevron-down arrow" :class="{ 'rotated': isOpen }"></i>
    </button>

    <transition name="dropdown">
      <div v-if="isOpen" class="language-dropdown">
        <button
          v-for="lang in availableLanguages"
          :key="lang.code"
          @click="selectLanguage(lang.code)"
          class="language-option"
          :class="{ 'selected': currentLanguage === lang.code }"
        >
          <span class="flag-icon">{{ lang.flag }}</span>
          <span>{{ lang.name }}</span>
          <i v-if="currentLanguage === lang.code" class="pi pi-check"></i>
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLocalization } from '../composables/useLocalization.js'

export default {
  name: 'LanguageSwitcher',
  setup() {
    const { currentLanguage, availableLanguages, changeLanguage } = useLocalization()
    const isOpen = ref(false)
    const switcher = ref(null)

    const currentLanguageData = computed(() => 
      availableLanguages.find(lang => lang.code === currentLanguage.value)
    )

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }

    const selectLanguage = (langCode) => {
      changeLanguage(langCode)
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
      currentLanguageData,
      toggleDropdown,
      selectLanguage
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
  font-size: 16px;
  margin-right: 8px;
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
