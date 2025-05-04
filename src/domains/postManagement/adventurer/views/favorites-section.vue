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
    <h1 class="favorites-title">Mis Actividades Favoritas</h1>

    <div v-if="loading" class="loading-state">
      <ProgressSpinner/>
      <p>Cargando tus favoritos...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <Button label="Reintentar" @click="loadFavorites" icon="pi pi-refresh"/>
    </div>

    <div v-else-if="favorites.length === 0" class="empty-state">
      <i class="pi pi-heart-fill empty-icon"></i>
      <h2>No tienes actividades favoritas</h2>
      <p>Explora actividades y marca como favorito las que te gusten</p>
      <Button label="Explorar actividades" icon="pi pi-search" @click="$router.push({name: 'AdventurerSearch'})"/>
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
  padding: 2rem 1rem;
}

.favorites-title {
  color: #765532;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 600;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1rem;
  min-height: 50vh;
}

.empty-icon {
  font-size: 4rem;
  color: #A88662;
  margin-bottom: 1rem;
}

.empty-state h2 {
  color: #765532;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 2rem;
}
</style>