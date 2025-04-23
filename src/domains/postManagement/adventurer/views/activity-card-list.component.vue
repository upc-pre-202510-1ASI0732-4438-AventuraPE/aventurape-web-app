<script>
import { ActivityApiService } from '@/domains/postManagement/shared/services/activity-api.service.js';

export default {
  name: "ActivityCardList",
  data() {
    return {
      activities: [],
      loading: true,
      searchQuery: "",
      viewMode: "grid",
      selectedActivity: null,
      activityApiService: new ActivityApiService()
    };
  },

  computed: {
    filteredActivities() {
      if (!this.searchQuery) return this.activities;

      const query = this.searchQuery.toLowerCase();
      return this.activities.filter(activity =>
          activity.title.toLowerCase().includes(query)
      );
    }
  },

  methods: {
    selectActivity(activityId) {
      this.selectedActivity = activityId;
    },

    goToDetail(activityId) {
      this.$router.push({
        name: 'activity-detail',
        params: { id: activityId }
      });
    },

    async fetchActivities() {
      this.loading = true;
      try {
        const response = await this.activityApiService.getAllActivities();

        // Mapear los datos del backend a nuestro formato local
        this.activities = response.data.map(item => ({
          id: item.Id,
          title: item.nameActivity,
          description: item.description,
          cantPeople: item.cantPeople,
          image: item.image || 'https://primefaces.org/cdn/primevue/images/usercard.png',
          price: item.cost,
          timeDuration: item.timeDuration,
          entrepreneurId: item.entrepreneurId
        }));

        this.loading = false;
      } catch (error) {
        console.error('Error al cargar actividades:', error);
        this.loading = false;
      }
    }
  },

  mounted() {
    this.fetchActivities();
  }
};
</script>

<template>
  <div class="product-grid-container">
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Buscar actividades" class="search-input" />
      <span class="items-count">{{ activities.length }} Actividades</span>
      <div class="view-options">
        <button class="list-view-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">☰</button>
        <button class="grid-view-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">☷</button>
      </div>
    </div>

    <div class="product-grid" :class="{ 'list-view': viewMode === 'list' }">
      <div
          v-for="(activity, index) in filteredActivities"
          :key="activity.id"
          class="product-card"
          :class="{ active: selectedActivity === activity.id }"
          @click="selectActivity(activity.id)"
      >
        <div class="card-content">
          <img :src="activity.image || 'https://primefaces.org/cdn/primevue/images/usercard.png'" :alt="activity.title" />
          <div class="product-title">{{ activity.title }}</div>
        </div>
        <div class="hover-overlay" :class="{ active: selectedActivity === activity.id }">
          <button class="detail-btn" @click.stop="goToDetail(activity.id)">DETALLE</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-message">
      Cargando actividades...
    </div>
    <div v-else-if="activities.length === 0" class="no-results">
      No se encontraron actividades
    </div>
  </div>
</template>

<style scoped>
.product-grid-container {
  width: 100%;
  max-width: 1200px;
  margin: 70px auto 0; /* Ajuste para el header fijo */
  font-family: Arial, sans-serif;
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 40%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>');
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 16px;
  padding-left: 35px;
}

.items-count {
  color: #666;
  font-size: 14px;
}

.view-options {
  display: flex;
  gap: 5px;
}

.list-view-btn, .grid-view-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 5px 10px;
  cursor: pointer;
}

.view-options .active {
  background-color: #f0f0f0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-grid.list-view {
  grid-template-columns: 1fr;
}

.product-card {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.card-number {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 25px;
  height: 25px;
  background-color: #ff4d4f;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  z-index: 1;
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.card-content img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  margin-bottom: 15px;
}

.edit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.7;
}

.product-title {
  font-size: 14px;
  text-align: center;
  color: #333;
  margin-top: 10px;
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(177, 150, 117, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.detail-btn {
  background-color: white;
  color: #b19675;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

/* Hover effects */
.product-card:hover .hover-overlay,
.product-card.active .hover-overlay {
  opacity: 1;
  pointer-events: auto;
}

.product-card.active {
  background-color: #f9f3e5;
}

/* For demonstration - card 3 is shown as active */
.hover-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.loading-message, .no-results {
  text-align: center;
  padding: 30px;
  color: #666;
  font-size: 16px;
}

@media (max-width: 992px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .search-input {
    width: 60%;
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }

  .search-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .search-input {
    width: 100%;
  }

  .items-count {
    margin-bottom: 10px;
  }
}
</style>