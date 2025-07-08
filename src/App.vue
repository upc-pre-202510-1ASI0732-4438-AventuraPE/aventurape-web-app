<script setup>
import HeaderNav from './shared/components/HeaderNav.vue';
import BarbaraChat from './shared/components/BarbaraChat.vue';
import { ref, computed, onMounted } from 'vue';
import { useAuthenticationStore } from '@/domains/IAM/services/authentication.store.js';
import { useTheme } from '@/shared/composables/useTheme.js';

const authStore = useAuthenticationStore();
const { initializeTheme, isDarkMode } = useTheme();

const isAuthenticated = computed(() => {
  return authStore.isSignedIn;
});

onMounted(() => {
  initializeTheme();
});
</script>

<template>
  <div class="app-container" :class="{ 'dark-theme': isDarkMode }">
    <HeaderNav v-if="isAuthenticated" />
    <main class="main-content" :class="{ 'no-header': !isAuthenticated, 'dark-theme': isDarkMode }">
      <router-view />
    </main>

    <!-- Chat de Barbara Nexus - disponible para todos los usuarios -->
    <BarbaraChat />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background-color: var(--theme-bg-primary, #f8f5f0);
  color: var(--theme-text-primary, #333333);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.main-content {
  font-family: 'Nunito', sans-serif;
  padding-top: 60px;
  flex: 1;
  width: 100%;
}

.main-content.no-header {
  padding-top: 0;
}

.header-fixed {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}
</style>