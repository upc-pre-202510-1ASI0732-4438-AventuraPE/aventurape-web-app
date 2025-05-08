<template>
  <div v-if="profileRequired" class="profile-required-overlay">
    <div class="profile-required-modal">
      <h2><i class="fa-solid fa-exclamation-circle"></i> Perfil Requerido</h2>
      <p>Por favor completa tu perfil para continuar navegando en la aplicación.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileRequired',
  data() {
    return {
      isProfileRequired: false
    };
  },
  mounted() {
    this.checkProfileRequired();
    window.addEventListener('storage', this.checkProfileRequired);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.checkProfileRequired);
  },
  methods: {
    checkProfileRequired() {
      this.isProfileRequired = localStorage.getItem('profileRequired') === 'true';
    }
  }
}
</script>

<style scoped>
.profile-required-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-required-modal {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

h2 {
  color: #765532;
  margin-bottom: 1rem;
}

i {
  margin-right: 0.5rem;
  color: #f15c5c;
}
</style>