<script>
import FavoriteCard from '../components/favorite-card.component.vue';
import { ActivityApiService } from '../../shared/services/activity-api.service';
import Cookies from 'js-cookie';

export default {
  name: 'FavoritesView',
  components: {
    FavoriteCard
  },
  data() {
    return {
      favorites: [],
      activities: {},
      loading: true,
      error: null,
      activityApiService: new ActivityApiService()
    };
  },
  async mounted() {
    await this.loadFavorites();
  },
  methods: {
    async loadFavorites() {
      try {
        this.loading = true;
        const userId = Cookies.get('userId');

        if (!userId) {
          this.error = "Usuario no identificado";
          return;
        }

        const response = await this.activityApiService.getFavoritePublicationsByProfileId(userId);
        this.favorites = response.data;

        // Cargar los detalles de cada actividad favorita
        await this.loadActivitiesDetails();
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
        this.error = "No se pudieron cargar los favoritos";
      } finally {
        this.loading = false;
      }
    },

    async loadActivitiesDetails() {
      for (const favorite of this.favorites) {
        try {
          const response = await this.activityApiService.getActivityById(favorite.publicationId);
          this.activities[favorite.publicationId] = response.data;
        } catch (error) {
          console.error(`Error al cargar detalles de actividad ${favorite.publicationId}:`, error);
        }
      }
    },

    handleFavoriteRemoved(favoriteId) {
      this.favorites = this.favorites.filter(favorite => favorite.id !== favoriteId);
    }
  }
}
</script>

<template>
  <div class="favorites-container">
    <div class="favorites-header">
      <h1 class="favorites-title">Mis Actividades Favoritas</h1>
      <p class="favorites-subtitle">Encuentra aquí todas las experiencias que has marcado como favoritas</p>
    </div>

    <div v-if="loading" class="loading-state">
      <ProgressSpinner class="custom-spinner" />
      <p>Cargando tus favoritos...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="pi pi-exclamation-triangle error-icon"></i>
      <h3>No pudimos cargar tus favoritos</h3>
      <p>{{ error }}</p>
      <Button label="Reintentar" @click="loadFavorites" icon="pi pi-refresh" class="retry-button"/>
    </div>

    <div v-else-if="favorites.length === 0" class="empty-state">
      <i class="pi pi-heart-fill empty-icon"></i>
      <h2>No tienes actividades favoritas</h2>
      <p>Explora actividades y marca como favorito las que te gusten para encontrarlas aquí</p>
      <Button label="Explorar actividades" icon="pi pi-search" @click="$router.push({name: 'AdventurerSearch'})" class="explore-button"/>
    </div>

    <div v-else class="favorites-grid">
      <div v-for="favorite in favorites" :key="favorite.id" class="favorite-item">
        <FavoriteCard
            v-if="activities[favorite.publicationId]"
            :favorite="favorite"
            :activity="activities[favorite.publicationId]"
            @removed="handleFavoriteRemoved"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.favorites-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.favorites-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  padding-bottom: 1.5rem;
}

.favorites-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-light), var(--primary-color));
  border-radius: 2px;
}

.favorites-title {
  color: var(--primary-color);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.favorites-subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
}

.favorite-item {
  height: 100%;
  transition: all 0.4s ease;
}

.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5rem 2rem;
  min-height: 50vh;
  background: linear-gradient(to bottom right, #ffffff, var(--primary-lighter));
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(118, 85, 50, 0.08);
  border: 1px solid rgba(118, 85, 50, 0.1);
}

.custom-spinner ::v-deep(.p-progress-spinner-circle) {
  stroke: var(--primary-color) !important;
}

.loading-state p {
  color: var(--text-light);
  font-size: 1.1rem;
  margin-top: 1.5rem;
}

.error-icon {
  font-size: 3rem;
  color: var(--error-color);
  margin-bottom: 1.5rem;
}

.error-state h3 {
  color: var(--text-dark);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.error-state p {
  color: var(--text-light);
  margin-bottom: 1.5rem;
}

.retry-button {
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light)) !important;
  border: none !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 30px !important;
}

.retry-button:hover {
  box-shadow: 0 8px 20px rgba(118, 85, 50, 0.25) !important;
  transform: translateY(-2px) !important;
}

.empty-icon {
  font-size: 4rem;
  color: var(--primary-light);
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.empty-state h2 {
  color: var(--primary-color);
  font-size: 1.7rem;
  margin-bottom: 0.8rem;
  font-weight: 600;
}

.empty-state p {
  color: var(--text-light);
  margin-bottom: 2rem;
  max-width: 400px;
}

.explore-button {
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light)) !important;
  border: none !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 30px !important;
  font-weight: 500 !important;
  box-shadow: 0 6px 15px rgba(118, 85, 50, 0.2) !important;
  transition: all 0.3s ease !important;
}

.explore-button:hover {
  box-shadow: 0 10px 25px rgba(118, 85, 50, 0.3) !important;
  transform: translateY(-3px) !important;
}

@media (max-width: 992px) {
  .favorites-title {
    font-size: 2.2rem;
  }

  .favorites-grid {
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .favorites-container {
    padding: 2rem 1rem;
  }

  .favorites-title {
    font-size: 1.8rem;
  }

  .favorites-subtitle {
    font-size: 1rem;
  }

  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 576px) {
  .favorites-header {
    margin-bottom: 2rem;
  }

  .favorites-title {
    font-size: 1.6rem;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .loading-state, .error-state, .empty-state {
    padding: 3rem 1.5rem;
  }
}
</style>