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
    },

    handleImageError(event) {
      console.warn('Error loading image:', this.activity.image);
      // Opcional: establecer una imagen por defecto
      // event.target.src = '/path/to/default-image.jpg';
    },

    handleImageLoad(event) {
      console.log('Image loaded successfully:', this.activity.image);
    }
  }};
</script>
<template>
  <Card class="favorite-card" @click="goToDetail">
    <template #header>
      <div class="image-container">
        <img
            :src="activity.image"
            :alt="activity.nameActivity"
            @error="handleImageError"
            @load="handleImageLoad"
        />
        <div class="card-price-tag">
          <span>S/. {{ activity.cost?.toFixed(2) }}</span>
        </div>
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

/* DARK MODE STYLES FOR FAVORITE CARD */
.dark-theme .favorite-card {
  background: var(--theme-bg-card) !important;
  border: none !important;
  box-shadow: var(--theme-shadow-soft) !important;
}

.dark-theme .favorite-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--theme-shadow-hover) !important;
}

.favorite-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(118, 85, 50, 0.15);
}

/* Control de tamaño para imágenes en el encabezado */
.image-container {
  height: 200px;
  overflow: hidden;
  position: relative;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.p-card-header) {
  height: 200px;
  overflow: hidden;
  position: relative;
  background: transparent !important;
  padding: 0 !important;
}

.image-container img,
:deep(.p-card-header img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
  background-color: #f5f5f5;
}

.favorite-card:hover .image-container img,
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
  line-clamp: 3;
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
  background: linear-gradient(135deg, #8b6914, #a67c00) !important;
  border: none !important;
  box-shadow: 0 4px 10px rgba(139, 105, 20, 0.25) !important;
  color: #f8f4ee !important;
}

.p-button-primary:hover {
  background: linear-gradient(135deg, #a67c00, #c4a876) !important;
  box-shadow: 0 6px 15px rgba(139, 105, 20, 0.35) !important;
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

/* Card price tag styles */
.card-price-tag {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #8b6914, #a67c00);
  color: #f8f4ee;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 2;
  pointer-events: none;
}

.dark-theme .card-price-tag {
  background: linear-gradient(135deg, #6b4e3d, #8b5a4a);
  color: #f8f4ee;
}

/* Efecto de superposición con información - REMOVIDO PARA MEJOR VISIBILIDAD DE IMAGEN */
/* :deep(.p-card-header)::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%);
} */

/* ENHANCED DARK MODE STYLES FOR FAVORITE CARDS */
.dark-theme :deep(.p-card-body) {
  background: var(--theme-bg-card) !important;
}

.dark-theme .image-container {
  background: #3d3426;
}

.dark-theme :deep(.p-card-header) {
  background: transparent !important;
  position: relative;
  z-index: 1;
}

.dark-theme .image-container img,
.dark-theme :deep(.p-card-header img) {
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
  filter: brightness(1) contrast(1) !important;
  background-color: #3d3426;
  border-radius: 0;
  z-index: 1;
  position: relative;
}

/* Asegurar que ningún pseudo-elemento oculte la imagen en dark mode */
.dark-theme :deep(.p-card-header)::before,
.dark-theme :deep(.p-card-header)::after {
  display: none !important;
}

/* Forzar visibilidad de imagen en cualquier condición */
.dark-theme .favorite-card img,
.dark-theme .favorite-card :deep(img),
.dark-theme .image-container img {
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
}

.dark-theme :deep(.p-card-title) {
  color: var(--theme-text-primary) !important;
}

.dark-theme :deep(.p-card-title):after {
  background: linear-gradient(to right, var(--theme-accent-light), var(--theme-accent-hover)) !important;
}

.dark-theme .card-meta {
  color: var(--theme-text-secondary) !important;
}

.dark-theme .meta-item {
  background-color: var(--theme-bg-glass) !important;
  color: var(--theme-text-secondary) !important;
}

.dark-theme .meta-item i {
  color: var(--theme-accent-light) !important;
}

.dark-theme .card-description {
  color: var(--theme-text-secondary) !important;
}

/* IMPROVED BUTTON COLORS FOR DARK MODE */
.dark-theme .p-button-primary {
  background: linear-gradient(135deg, #6b4e3d, #8b5a4a) !important;
  border: none !important;
  box-shadow: 0 4px 10px rgba(107, 78, 61, 0.3) !important;
  color: #f8f4ee !important;
}

.dark-theme .p-button-primary:hover {
  background: linear-gradient(135deg, #8b5a4a, #a67c5e) !important;
  box-shadow: 0 6px 15px rgba(107, 78, 61, 0.4) !important;
  transform: translateY(-2px) !important;
}

.dark-theme .p-button-danger {
  background: var(--theme-bg-glass) !important;
  border: 1px solid #ff6b6b !important;
  color: #ff6b6b !important;
}

.dark-theme .p-button-danger:hover {
  background: rgba(255, 107, 107, 0.1) !important;
  box-shadow: 0 4px 8px rgba(255, 107, 107, 0.15) !important;
}
</style>