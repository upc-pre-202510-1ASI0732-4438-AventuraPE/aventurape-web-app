<template>
  <div class="controls-container">
    <LanguageSwitcher />
    <ThemeToggle />
  </div>
</template>

<script>
import LanguageSwitcher from './LanguageSwitcher.vue'
import ThemeToggle from './ThemeToggle.vue'

export default {
  name: 'AppControls',
  components: {
    LanguageSwitcher,
    ThemeToggle
  }
}
</script>

<style scoped>
.controls-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

@media (max-width: 768px) {
  .controls-container {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
}
</style>
