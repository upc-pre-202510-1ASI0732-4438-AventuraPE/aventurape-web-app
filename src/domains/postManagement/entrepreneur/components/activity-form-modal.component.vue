<script>
export default {
  name: "ActivityFormModal",
  props: {
    show: {
      type: Boolean,
      required: true
    },
    editingPublication: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      publication: {
        nameActivity: '',
        description: '',
        timeDuration: '',
        image: '',
        cantPeople: '',
        cost: ''
      }
    }
  },
  watch: {
    editingPublication(newValue) {
      if (newValue) {
        this.publication = {
          nameActivity: newValue.nameActivity,
          description: newValue.description,
          timeDuration: newValue.timeDuration,
          image: newValue.image,
          cantPeople: newValue.cantPeople,
          cost: newValue.cost
        };
      } else {
        this.resetForm();
      }
    },
    show(newValue) {
      if (!newValue) {
        this.resetForm();
      }
    }
  },
  methods: {
    savePublication() {
      this.$emit('save', this.publication);
    },
    closeModal() {
      this.$emit('close');
    },
    resetForm() {
      this.publication = {
        nameActivity: '',
        description: '',
        timeDuration: '',
        image: '',
        cantPeople: '',
        cost: ''
      };
    }
  }
}
</script>

<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">{{ editingPublication ? 'Editar Actividad' : 'Nueva Actividad' }}</h2>
        <button @click="closeModal" class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="savePublication">
          <div class="form-group">
            <label for="title">Título</label>
            <input type="text" id="title" v-model="publication.nameActivity" required placeholder="Nombre de la actividad">
          </div>

          <div class="form-group">
            <label for="description">Descripción</label>
            <textarea id="description" v-model="publication.description" required placeholder="Describe tu actividad..."></textarea>
          </div>

          <div class="form-row">
            <div class="form-group half-width">
              <label for="duration">Duración (min)</label>
              <input type="number" id="duration" v-model="publication.timeDuration" required min="1">
            </div>

            <div class="form-group half-width">
              <label for="capacity">Capacidad</label>
              <input type="number" id="capacity" v-model="publication.cantPeople" required min="1">
            </div>
          </div>

          <div class="form-group">
            <label for="image">URL de Imagen</label>
            <input type="text" id="image" v-model="publication.image" placeholder="https://ejemplo.com/imagen.jpg">
            <small class="form-hint">Ingresa la URL de una imagen representativa</small>
          </div>

          <div class="form-group">
            <label for="price">Precio ($)</label>
            <input type="number" id="price" v-model="publication.cost" required min="0" step="0.01">
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">
              {{ editingPublication ? 'Actualizar' : 'Publicar' }}
            </button>
          </div>
        </form>
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
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
  color: var(--primary-color);
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

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-dark);
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border 0.3s;
  font-size: 16px;
}

.form-group input:focus, .form-group textarea:focus {
  border-color: var(--primary-light);
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.form-hint {
  color: var(--text-light);
  font-size: 14px;
  margin-top: 6px;
  display: block;
}

.form-row {
  display: flex;
  gap: 20px;
}

.half-width {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  gap: 10px;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background-color: var(--primary-light);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
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
</style>