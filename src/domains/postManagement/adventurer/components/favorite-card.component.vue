<script>
import { ActivityApiService } from '../../shared/services/activity-api.service';
import Cookies from 'js-cookie';
import ActivityDetail from "@/domains/postManagement/adventurer/views/activity-detail.component.vue";

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
    async removeFromFavorites(event) {
      event.stopPropagation(); // Evitar la propagación del evento
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
    },

    goToDetail() {
      this.$router.push({
        name: 'activity-detail',
        params: { id: this.activity.Id || this.activity.id }
      });
    }
  }};
</script>
<template>
  <Card class="favorite-card" @click="goToDetail">
    <template #header>
      <img :src="activity.image" :alt="activity.nameActivity" />
      <div class="card-price-tag">
        <span>S/. {{ activity.cost?.toFixed(2) }}</span>
      </div>
    </template>
    <template #title>{{ activity.nameActivity }}</template>
    <template #subtitle>
      <div class="card-meta">
        <span class="meta-item">
          <i class="pi pi-users"></i> {{ activity.cantPeople }} personas
        </span>
        <span class="meta-item">
          <i class="pi pi-clock"></i> {{ Math.floor(activity.timeDuration / 60) }}h {{ activity.timeDuration % 60 }}min
        </span>
      </div>
    </template>
    <template #content>
      <p class="card-description">{{ activity.description }}</p>
      <div class="card-actions">
        <Button
            label="Ver detalles"
            icon="pi pi-eye"
            class="p-button-primary"
            @click="goToDetail"
        />
        <Button
            icon="pi pi-trash"
            class="p-button-danger"
            @click="removeFromFavorites($event)"
            tooltip="Eliminar de favoritos"
            tooltipOptions="{ position: 'top', class: 'custom-tooltip' }"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.favorite-card {
  cursor: pointer;
  transition: all 0.4s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(118, 85, 50, 0.1);
  border: 1px solid rgba(118, 85, 50, 0.05);
}

.favorite-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(118, 85, 50, 0.15);
}

/* Control de tamaño para imágenes en el encabezado */
:deep(.p-card-header) {
  height: 200px;
  overflow: hidden;
  position: relative;
}

:deep(.p-card-header img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

:deep(.p-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px !important;
}

.favorite-card:hover :deep(.p-card-header img) {
  transform: scale(1.08);
}

:deep(.p-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 18px !important;
  background: linear-gradient(to bottom, #fff, #f9f5f0);
}

:deep(.p-card-title) {
  font-weight: 700;
  font-size: 1.2rem;
  color: #765532;
  margin-bottom: 12px !important;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  padding-bottom: 8px;
}

:deep(.p-card-title):after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, #A88662, #D4B08C);
  border-radius: 3px;
}

:deep(.p-card-subtitle) {
  padding: 0;
  margin-bottom: 15px !important;
}

:deep(.p-card-content) {
  flex: 1;
  padding: 5px 0 15px 0 !important;
  margin-bottom: 0 !important;
  display: flex;
  flex-direction: column;
}

.favorite-card:hover :deep(.p-card-header img) {
  transform: scale(1.08);
}

:deep(.p-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 18px !important;
  background: linear-gradient(to bottom, #fff, #f9f5f0);
}

:deep(.p-card-title) {
  font-weight: 700;
  font-size: 1.2rem;
  color: #765532;
  margin-bottom: 12px !important;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  padding-bottom: 8px;
}

:deep(.p-card-title):after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, #A88662, #D4B08C);
  border-radius: 3px;
}

:deep(.p-card-subtitle) {
  padding: 0;
  margin-bottom: 15px !important;
}

:deep(.p-card-content) {
  flex: 1;
  padding: 5px 0 15px 0 !important;
  margin-bottom: 0 !important;
  display: flex;
  flex-direction: column;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.95rem;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background-color: rgba(168, 134, 98, 0.08);
  border-radius: 20px;
  font-weight: 500;
}

.meta-item i {
  margin-right: 6px;
  color: #A88662;
  font-size: 1rem;
}

.card-description {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 18px;
  flex: 1;
}

.card-actions {
  display: flex;
  gap: 5px;
}

.card-actions .p-button {
  flex: 1;
  transition: all 0.3s ease;
  border-radius: 25px;
}

.p-button-primary {
  background: linear-gradient(135deg, #765532, #A88662) !important;
  border: none !important;
  box-shadow: 0 4px 10px rgba(118, 85, 50, 0.25) !important;
}

.p-button-primary:hover {
  box-shadow: 0 6px 15px rgba(118, 85, 50, 0.35) !important;
  transform: translateY(-2px) !important;
}

.p-button-danger {
  background: white !important;
  border: 1px solid #ff4d4d !important;
  color: #ff4d4d !important;
}

.p-button-danger:hover {
  background: #fff5f5 !important;
  box-shadow: 0 4px 8px rgba(255, 77, 77, 0.15) !important;
  transform: translateY(-2px) !important;
}

/* Efecto de superposición con información */
:deep(.p-card-header)::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%);
}
</style>