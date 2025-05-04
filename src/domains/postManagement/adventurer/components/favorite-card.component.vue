<script>
import { ActivityApiService } from '../../shared/services/activity-api.service';
import Cookies from 'js-cookie';

export default {
  name: "FavoriteCard",
  props: {
    favorite: {
      type: Object,
      required: true
    },
    activity: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activityApiService: new ActivityApiService()
    };
  },
  methods: {
    goToDetail() {
      this.$router.push({
        name: 'activity-detail',
        params: { id: this.activity.id }
      });
    },
    async removeFromFavorites() {
      try {
        await this.activityApiService.removeFromFavorites(this.favorite.id);
        this.$emit('removed', this.favorite.id);
        this.$toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Actividad eliminada de favoritos',
          life: 3000
        });
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar de favoritos',
          life: 3000
        });
        console.error('Error al eliminar de favoritos:', error);
      }
    }
  }
};
</script>

<template>
  <Card class="favorite-card">
    <template #header>
      <img :src="activity.image" :alt="activity.nameActivity" />
    </template>
    <template #title>{{ activity.nameActivity }}</template>
    <template #subtitle>
      <div class="card-meta">
        <span class="meta-item">
          <i class="pi pi-users"></i> {{ activity.cantPeople }} personas
        </span>
        <span class="meta-item">
          <i class="pi pi-tag"></i>S/. {{ activity.cost?.toFixed(2) }}
        </span>
      </div>
    </template>
    <template #content>
      <p class="card-description">{{ activity.description }}</p>
      <div class="card-actions">
        <Button icon="pi pi-trash" class="p-button-danger" @click.stop="removeFromFavorites"
                tooltip="Eliminar de favoritos" />
        <Button icon="pi pi-eye" @click.stop="goToDetail" tooltip="Ver detalles" />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.favorite-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.favorite-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* Control de tamaño para imágenes en el encabezado */
:deep(.p-card-header) {
  height: 200px;
  overflow: hidden;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

:deep(.p-card-header img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

:deep(.p-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px !important;
}

:deep(.p-card-title) {
  padding: 0 5px;
  margin-bottom: 10px !important;
}

:deep(.p-card-subtitle) {
  padding: 0 5px;
}

:deep(.p-card-content) {
  flex: 1;
  padding: 10px 5px !important;
  margin-bottom: 0 !important;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.meta-item i {
  margin-right: 4px;
}

.card-description {
  color: #666;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 5px;
  margin-bottom: 15px;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}
</style>