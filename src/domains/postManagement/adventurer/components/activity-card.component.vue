<script>
import Cookies from 'js-cookie';
import {ActivityApiService} from "@/domains/postManagement/shared/services/activity-api.service.js";

export default {
  name: "ActivityCard",
  components: {},
  props: {
    id: Number,
    title: String,
    image: String,
    people: Number,
    description: String,
    price: Number,
    timeDuration: Number,
  },
  data() {
    return {
      isFavorite: false,
      favoriteId: null,
      loading: false,
      activityApiService: new ActivityApiService()
    };
  },
  mounted() {
    this.checkIfFavorite();
  },
  methods: {
    goToDetail() {
      this.$router.push({
        name: 'activity-detail',
        params: { id: this.id }
      });
    },

    async checkIfFavorite() {
      try {
        const userId = Cookies.get('userId');
        if (!userId) return;

        const response = await this.activityApiService.getFavoritePublicationsByProfileId(userId);
        const favorites = response.data;

        const foundFavorite = favorites.find(fav => fav.publicationId === this.id);
        if (foundFavorite) {
          this.isFavorite = true;
          this.favoriteId = foundFavorite.id;
        }
      } catch (error) {
        console.error('Error al verificar favoritos:', error);
      }
    },

    async toggleFavorite(event) {
      event.stopPropagation();

      try {
        this.loading = true;
        const userId = Cookies.get('userId');

        if (!userId) {
          this.$toast.add({
            severity: 'warn',
            summary: 'Acción requerida',
            detail: 'Debes iniciar sesión para guardar favoritos',
            life: 3000
          });
          return;
        }

        if (this.isFavorite) {
          await this.activityApiService.removeFromFavorites(this.favoriteId);
          this.isFavorite = false;
          this.favoriteId = null;
          this.$toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Eliminado de favoritos',
            life: 3000
          });
        } else {
          const response = await this.activityApiService.addToFavorites({
            publicationId: this.id
          });
          this.isFavorite = true;
          this.favoriteId = response.data.id;
          this.$toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Añadido a favoritos',
            life: 3000
          });
        }
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al procesar tu solicitud',
          life: 3000
        });
        console.error('Error al gestionar favorito:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<template>
  <Card class="activity-card" @click="goToDetail">
    <template #header>
      <img :src="image" :alt="title" />
    </template>
    <template #title>{{ title }}</template>
    <template #subtitle>
      <div class="card-meta">
        <span class="meta-item">
          <i class="pi pi-users"></i> {{ people }} personas
        </span>
        <span class="meta-item">
          <i class="pi pi-tag"></i>S/. {{ price.toFixed(2) }}
        </span>

        <!--Boton de favorito--->
        <span class="meta-item favorite-button" @click.stop="toggleFavorite($event)">
          <i v-if="loading" class="pi pi-spin pi-spinner"></i>
          <i v-else :class="['pi', isFavorite ? 'pi-heart-fill favorite-active' : 'pi-heart']"></i>
        </span>
      </div>
    </template>
    <template #content>
      <p class="card-description">{{ description }}</p>
    </template>
  </Card>
</template>

<style scoped>
.favorite-button {
  cursor: pointer;
  transition: all 0.2s ease;
}

.favorite-button:hover {
  transform: scale(1.2);
}

.favorite-active {
  color: #ff5252;
}
.activity-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.activity-card:hover {
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

/* Mejora del padding en todas las secciones de la tarjeta */
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
}
</style>