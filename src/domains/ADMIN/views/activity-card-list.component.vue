<template>
  <div class="product-grid-container">
    <div class="search-section">
      <div class="search-bar">
        <div class="search-input-container">
          <i class="pi pi-search search-icon"></i>
          <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar actividades"
              class="search-input"
              v-focus
          />
          <transition name="fade">
            <i
                v-if="searchQuery"
                class="pi pi-times clear-icon"
                @click="clearSearch"
            ></i>
          </transition>
        </div>
      </div>

      <div class="search-controls">
        <transition name="fade-slide">
          <span class="items-count" v-if="!loading">
            {{ filteredActivities.length }} de {{ activities.length }} Actividades
          </span>
        </transition>
        <div class="view-options">
          <button
              class="view-btn list-view-btn"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
              title="Vista de lista"
          >
            <i class="pi pi-list"></i>
          </button>
          <button
              class="view-btn grid-view-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              title="Vista de cuadrícula"
          >
            <i class="pi pi-th-large"></i>
          </button>
        </div>
      </div>
    </div>

    <transition name="fade-slow" mode="out-in">
      <div v-if="loading" class="loading-message" key="loading">
        <i class="pi pi-spin pi-spinner"></i>
        <span>Cargando actividades...</span>
      </div>

      <div v-else-if="filteredActivities.length === 0" class="no-results" key="empty">
        <i class="pi pi-search"></i>
        <span>No se encontraron actividades para "{{ searchQuery }}"</span>
        <button class="reset-search-btn" @click="clearSearch">Limpiar búsqueda</button>
      </div>

      <div v-else class="product-grid" :class="{ 'list-view': viewMode === 'list' }" key="results">
        <transition-group name="activity-item" tag="div" class="grid-container">
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
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script>
import { ActivityApiService } from '@/domains/postManagement/shared/services/activity-api.service.js';

export default {
  name: "ActivityCardList",
  directives: {
    focus: {
      inserted: function (el) {
        el.addEventListener('focus', () => {
          el.parentNode.classList.add('focused');
        });
        el.addEventListener('blur', () => {
          el.parentNode.classList.remove('focused');
        });
      }
    }
  },
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
    clearSearch() {
      this.searchQuery = "";
      // Enfocar nuevamente el campo de búsqueda
      this.$nextTick(() => {
        document.querySelector('.search-input').focus();
      });
    },

    selectActivity(activityId) {
      this.selectedActivity = activityId;
    },

    goToDetail(activityId) {
      this.$router.push({
        name: 'activity-detail',
        params: {id: activityId}
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

<style scoped>
.product-grid-container {
  width: 100%;
  max-width: 1200px;
  margin: 70px auto 0;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  padding: 20px;
}

/* Sección de búsqueda mejorada */
.search-section {
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.search-bar {
  display: flex;
  align-items: center;
}

.search-input-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  overflow: hidden;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-input-container.focused {
  border-color: var(--primary-color);
  background-color: white;
  box-shadow: 0 4px 12px rgba(118, 85, 50, 0.15);
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #777;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.search-input {
  width: 100%;
  padding: 14px 45px 14px 45px;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #aaa;
  transition: opacity 0.3s ease;
}

.search-input-container.focused .search-input::placeholder {
  opacity: 0.6;
}

.clear-icon {
  position: absolute;
  right: 16px;
  color: #777;
  cursor: pointer;
  font-size: 1rem;
  background-color: #f0f0f0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.clear-icon:hover {
  background-color: #e0e0e0;
  color: #333;
}

.search-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
}

.items-count {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  border-left: 3px solid var(--primary-light);
  padding-left: 10px;
}

.view-options {
  display: flex;
  gap: 8px;
}

.view-btn {
  background: none;
  border: 1px solid #ddd;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.view-btn i {
  font-size: 1rem;
  color: #777;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background-color: #f9f3e5;
  border-color: var(--primary-light);
}

.view-btn:hover i {
  color: var(--primary-color);
}

.view-options .active {
  background-color: #f9f3e5;
  border-color: var(--primary-color);
}

.view-options .active i {
  color: var(--primary-color);
}

/* Estilos de la cuadrícula y tarjetas */
.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: 100%;
}

.product-grid {
  display: flex;
  width: 100%;
}

.product-grid.list-view .grid-container {
  grid-template-columns: 1fr;
}

.product-card {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 20px rgba(118, 85, 50, 0.15);
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
  height: 180px;
  object-fit: cover;
  margin-bottom: 15px;
  border-radius: 8px;
  transition: all 0.4s ease;
}

.product-card:hover .card-content img {
  transform: scale(1.05);
}

.product-title {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #333;
  margin-top: 10px;
  transition: all 0.3s ease;
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(118, 85, 50, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.4s ease;
  pointer-events: none;
  transform: translateY(10px);
}

.detail-btn {
  background-color: white;
  color: var(--primary-color);
  border: none;
  padding: 10px 24px;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  transform: translateY(20px);
  opacity: 0;
}

.detail-btn:hover {
  background-color: #f9f3e5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.product-card:hover .hover-overlay,
.product-card.active .hover-overlay {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.product-card:hover .detail-btn,
.product-card.active .detail-btn {
  opacity: 1;
  transform: translateY(0);
}

.product-card.active {
  background-color: #f9f3e5;
  border-color: var(--primary-color);
}

/* Estados de carga y vacío */
.loading-message, .no-results {
  text-align: center;
  padding: 60px 30px;
  color: #666;
  font-size: 16px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.loading-message i, .no-results i {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 15px;
}

.reset-search-btn {
  margin-top: 15px;
  background-color: #f9f3e5;
  color: var(--primary-color);
  border: 1px solid var(--primary-light);
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-search-btn:hover {
  background-color: var(--primary-color);
  color: white;
}

/* Animaciones */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slow-enter-active, .fade-slow-leave-active {
  transition: opacity 0.5s ease;
}

.fade-slow-enter, .fade-slow-leave-to {
  opacity: 0;
}

.activity-item-enter-active, .activity-item-leave-active {
  transition: all 0.5s ease;
}

.activity-item-enter, .activity-item-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.activity-item-move {
  transition: transform 0.5s ease;
}

/* Responsive */
@media (max-width: 992px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .search-section {
    padding: 15px;
  }

  .search-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .view-options {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: 1fr;
  }

  .search-input-container {
    border-radius: 8px;
  }

  .search-input {
    padding: 12px 40px 12px 40px;
  }

  .search-section {
    margin-bottom: 20px;
  }
}
</style>