<template>
  <div class="theme-toggle" @click="toggleTheme">
    <div class="toggle-container" :class="{ 'dark': isDarkMode }">
      <div class="toggle-circle">
        <font-awesome-icon
            :icon="isDarkMode ? 'moon' : 'sun'"
            :class="{ 'icon-active': true }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '@/shared/composables/useTheme.js'

const { isDarkMode, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 10px;
  padding: 4px;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle:hover {
  background: rgba(100, 181, 246, 0.1);
  box-shadow: 0 0 15px rgba(100, 181, 246, 0.2);
}

.toggle-container {
  width: 60px;
  height: 32px;
  background: linear-gradient(135deg, #87CEEB 0%, #FFA500 50%, #FF6B6B 100%);
  border-radius: 20px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.2),
      0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.toggle-container.dark {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-color: rgba(100, 181, 246, 0.4);
  box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.4),
      0 4px 12px rgba(100, 181, 246, 0.2),
      0 0 20px rgba(100, 181, 246, 0.1);
}

.toggle-circle {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.3),
      inset 0 1px 1px rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.toggle-container.dark .toggle-circle {
  transform: translateX(28px);
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: #64b5f6;
  box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.4),
      0 0 15px rgba(100, 181, 246, 0.3),
      inset 0 1px 1px rgba(100, 181, 246, 0.2);
  border-color: rgba(100, 181, 246, 0.3);
}

.toggle-container:not(.dark) .toggle-circle {
  color: #f39c12;
  text-shadow: 0 0 8px rgba(243, 156, 18, 0.6);
}

.toggle-container.dark .toggle-circle {
  text-shadow: 0 0 10px rgba(100, 181, 246, 0.8);
}

.icon-active {
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1);
}

.theme-toggle:hover .toggle-container {
  transform: scale(1.05);
}

.theme-toggle:hover .icon-active {
  transform: scale(1.2);
}

.theme-toggle:active .toggle-container {
  transform: scale(0.98);
}

/* Glow effect for dark mode */
.toggle-container.dark {
  animation: darkGlow 2s infinite alternate;
}

@keyframes darkGlow {
  0% {
    box-shadow:
        inset 0 2px 4px rgba(0, 0, 0, 0.4),
        0 4px 12px rgba(100, 181, 246, 0.2),
        0 0 20px rgba(100, 181, 246, 0.1);
  }
  100% {
    box-shadow:
        inset 0 2px 4px rgba(0, 0, 0, 0.4),
        0 4px 12px rgba(100, 181, 246, 0.3),
        0 0 25px rgba(100, 181, 246, 0.2);
  }
}

/* Light mode subtle pulse */
.toggle-container:not(.dark) {
  animation: lightPulse 3s infinite;
}

@keyframes lightPulse {
  0%, 100% {
    box-shadow:
        inset 0 2px 4px rgba(0, 0, 0, 0.2),
        0 4px 12px rgba(0, 0, 0, 0.15);
  }
  50% {
    box-shadow:
        inset 0 2px 4px rgba(0, 0, 0, 0.2),
        0 4px 12px rgba(0, 0, 0, 0.15),
        0 0 15px rgba(243, 156, 18, 0.3);
  }
}

@media (max-width: 768px) {
  .toggle-container {
    width: 50px;
    height: 28px;
  }

  .toggle-circle {
    width: 24px;
    height: 24px;
  }

  .toggle-container.dark .toggle-circle {
    transform: translateX(22px);
  }

  .icon-active {
    font-size: 12px;
  }
}</style>
