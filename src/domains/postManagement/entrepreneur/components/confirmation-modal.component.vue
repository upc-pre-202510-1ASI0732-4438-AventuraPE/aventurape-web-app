<script>
export default {
  name: "ConfirmationModal",
  props: {
    show: {
      type: Boolean,
      required: true
    },
    publication: {
      type: Object,
      default: null
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.publication);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>

<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">Confirmar Eliminación</h2>
        <button @click="cancel" class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="confirmation-message">
          <i class="fas fa-exclamation-triangle warning-icon"></i>
          <p>¿Estás seguro de que deseas eliminar la actividad <strong>{{ publication?.nameActivity }}</strong>?</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </div>

        <div class="modal-actions">
          <button @click="cancel" class="btn-secondary">Cancelar</button>
          <button @click="confirm" class="btn-danger">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 10px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  animation: bounceIn 0.3s ease-out;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  70% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #eee;
}

.modal-title {
  color: var(--error-color);
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.close-button:hover {
  color: var(--error-color);
}

.modal-body {
  padding: 25px;
}

.confirmation-message {
  text-align: center;
  margin-bottom: 25px;
}

.warning-icon {
  font-size: 48px;
  color: var(--error-color);
  margin-bottom: 15px;
}

.warning-text {
  color: var(--error-color);
  font-weight: 500;
  margin-top: 10px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.btn-secondary {
  background-color: #e9e9e9;
  color: var(--text-dark);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background-color: #ddd;
}

.btn-danger {
  background-color: var(--error-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-danger:hover {
  background-color: #e53935;
  box-shadow: 0 4px 12px rgba(229, 57, 53, 0.3);
}
</style>