<script>
export default {
  name: "ActivityList",
  props: {
    publications: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'delete'],
  methods: {
    onEdit(publication) {
      this.$emit('edit', publication);
    },
    onDelete(publication) {
      this.$emit('delete', publication);
    }
  }
}
</script>

<template>
  <div class="content">
    <div class="content-header">
      <h2 class="section-title">Mis Actividades</h2>
      <div class="publication-count">{{ publications.length }} actividades</div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando...</p>
    </div>

    <div v-else-if="publications.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-clipboard-list"></i>
      </div>
      <p>No tienes actividades publicadas aún.</p>
      <p class="empty-hint">¡Crea tu primera actividad con el botón "Nueva Actividad"!</p>
    </div>

    <div v-else class="publications-list">
      <div v-for="pub in publications" :key="pub.id || pub.Id" class="publication-card">
        <div class="image-container">
          <img :src="pub.image" alt="Activity image" class="activity-image">
          <div class="price-badge">s/. {{ pub.cost }}</div>
        </div>
        <div class="card-content">
          <h3 class="card-title">{{ pub.nameActivity }}</h3>
          <p class="description">{{ pub.description }}</p>
          <div class="publication-details">
            <div class="detail-item">
              <i class="fas fa-clock detail-icon"></i>
              <span>{{ pub.timeDuration }} min</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-users detail-icon"></i>
              <span>{{ pub.cantPeople }} personas</span>
            </div>
          </div>
          <div class="publication-actions">
            <button @click="onEdit(pub)" class="btn-edit">
              <i class="fas fa-edit action-icon"></i> Editar
            </button>
            <button @click="onDelete(pub)" class="btn-delete">
              <i class="fas fa-trash-alt action-icon"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  background-color: var(--white);
  padding: 30px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-top: 30px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.section-title {
  color: var(--text-dark);
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.publication-count {
  background-color: var(--primary-lighter);
  color: var(--primary-color);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: var(--text-light);
}

.loading-spinner {
  border: 4px solid rgba(118, 85, 50, 0.1);
  border-left: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.publications-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 25px;
}

.publication-card {
  background-color: var(--white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.publication-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 20px;
}

.card-title {
  margin-top: 0;
  margin-bottom: 10px;
  color: var(--primary-color);
  font-size: 20px;
  font-weight: 600;
}

.description {
  color: var(--text-light);
  margin-bottom: 15px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.publication-details {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  color: var(--text-dark);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.detail-icon {
  color: var(--primary-color);
  font-size: 16px;
  width: 18px;
  text-align: center;
}

.publication-actions {
  display: flex;
  justify-content: flex-start;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.btn-edit, .btn-delete {
  background-color: #f8f5f0;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-edit:hover {
  background-color: var(--primary-lighter);
}

.btn-delete {
  background-color: #fff0f0;
  color: var(--error-color);
  border: 1px solid var(--error-color);
  margin-left: 10px;
}

.btn-delete:hover {
  background-color: #ffe5e5;
}

.image-container {
  width: 100%;
  height: 180px;
  overflow: hidden;
  position: relative;
}

.activity-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.publication-card:hover .activity-image {
  transform: scale(1.05);
}

.price-badge {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background-color: var(--primary-light);
  color: var(--white);
  padding: 8px 12px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: var(--text-light);
}

.empty-icon {
  font-size: 50px;
  margin-bottom: 20px;
  color: var(--primary-light);
}

.empty-hint {
  margin-top: 10px;
  font-style: italic;
  font-size: 14px;
}

.action-icon {
  color: inherit;
  font-size: 14px;
  margin-right: 5px;
}
</style>