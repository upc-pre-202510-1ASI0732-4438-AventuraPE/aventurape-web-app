<script>
import { ActivityApiService } from '@/domains/postManagement/shared/services/activity-api.service.js';
import ActivityCard from '../components/activity-card.component.vue';
import EntrepreneurCard from '../components/entrepreneur-card.component.vue';
import Carousel from 'primevue/carousel';
import TabMenu from 'primevue/tabmenu';
import AdventurerCard from "../components/adventurer-card.component.vue";
import ConfirmationModal from "../components/confirmation-modal.component.vue";

export default {
  name: "homeAdmin",
  components: {
    AdventurerCard,
    ActivityCard,
    EntrepreneurCard,
    ConfirmationModal,
    Carousel,
    TabMenu
  },
  data() {
    return {
      loading: false,
      loadingEntrepreneurs: false,
      //aventureros
      loadingAdventurer: false,
      activities: [],
      activeTab: 0,
      tabs: [
        { label: 'Aventuras', icon: 'pi pi-compass' },
        { label: 'Usuarios', icon: 'pi pi-users' }
      ],
      entrepreneurs: [],
      adventurers:[],
      activityApiService: new ActivityApiService(),
      showDeleteModal: false,
      publicationToDelete: null,
      error: null,
    };
  },

  computed: {
    carouselItems() {
      // Si no hay actividades, devolver array vacío
      if (!this.activities || this.activities.length === 0) {
        return [];
      }

      // Máximo 5 actividades para el carrusel
      return this.activities.slice(0, 5).map(activity => ({
        id: activity.id,
        title: activity.title,
        description: activity.description.substring(0, 120) + (activity.description.length > 120 ? '...' : ''),
        image: activity.image
      }));
    }
  },
  methods: {
    changeTab(index) {
      this.activeTab = index;
    },
    goToActivity(id) {
      this.$router.push({
        name: 'activity-detail',
        params: { id }
      });
    },
    openFormModal(publication = null) {
      this.editingPublication = publication;
      this.showFormModal = true;
    },

    openDeleteModal(publication) {
      this.publicationToDelete = publication;
      this.showDeleteModal = true;
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.publicationToDelete = null;
    },
    async confirmDelete() {
      try {
        this.loading = true;
        const activityService = new ActivityApiService();
        const id = this.publicationToDelete.id || this.publicationToDelete.Id;
        await activityService.deletePublication(id);
        this.closeDeleteModal();
        await this.fetchActivities();
      } catch (err) {
        this.error = `Error al eliminar la publicación: ${err.message}`;
        console.error("Error deleting publication:", err);
        this.loading = false;
      }
    },

    async fetchEntrepreneurs() {
      this.loadingEntrepreneurs = true;
      try {
        // Opción alternativa: usar endpoint de usuarios general y filtrar por rol
        const response = await this.activityApiService.getAllUsers();

        // Filtramos solo los usuarios con rol "ROLE_ENTREPRENEUR"
        this.entrepreneurs = response.data
            .filter(user => user.roles.includes("ROLE_ENTREPRENEUR"))
            .map(entrepreneur => ({
              id: entrepreneur.id,
              username: entrepreneur.username,
              avatar: null
            }));


        this.loadingEntrepreneurs = false;
      } catch (error) {
        console.error('Error al cargar emprendedores:', error);
        this.loadingEntrepreneurs = false;
      }
    },

    ///Aventureros

    async fetchAdventurers() {
      this.loadingAdventurer = true;
      try {
        // Opción alternativa: usar endpoint de usuarios general y filtrar por rol
        const response = await this.activityApiService.getAllUsers();

        // Filtramos solo los usuarios con rol "ROLE_ADVENTUROUS"
        this.adventurers = response.data
            .filter(user => user.roles.includes("ROLE_ADVENTUROUS"))
            .map(adventurer => ({
              id: adventurer.id,
              username: adventurer.username,
              avatar: null
            }));

        this.loadingAdventurer = false;
      } catch (error) {
        console.error('Error al cargar aventureros:', error);
        this.loadingAdventurer = false;
      }
    },
    async fetchActivities() {
      this.loading = true;
      try {
        const response = await this.activityApiService.getAllActivities();

        // Mapear los datos del backend al formato esperado por el componente ActivityCard
        this.activities = response.data.map(item => ({
          id: item.Id,
          title: item.nameActivity,
          description: item.description,
          people: item.cantPeople,
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
    }  },
  mounted() {
    this.fetchActivities();
    this.fetchEntrepreneurs();
    this.fetchAdventurers();
  }
};
</script>

<template>
  <div class="home-container">
    <!-- Navegación por pestañas -->
    <div class="navigation-tabs">
      <TabMenu :model="tabs" v-model:activeIndex="activeTab"/>
    </div>

    <!-- Contenido principal -->
    <main class="main-content">
      <!-- Panel de Aventuras -->
      <div v-if="activeTab === 0" class="tab-content activities-panel">
        <h2>Actividades del Sistema</h2>

        <!-- Estado de carga -->
        <div v-if="loading" class="loading-state">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <p>Cargando actividades...</p>
        </div>

        <!-- Sin resultados -->
        <div v-else-if="activities.length === 0" class="empty-state">
          <i class="pi pi-info-circle"></i>
          <p>No hay actividades disponibles en este momento</p>
        </div>

        <!-- Lista de actividades -->
        <div v-else class="activities-grid">
          <div
              v-for="activity in activities"
              :key="activity.id"
              class="activity-card-wrapper">
            <ActivityCard
                :id="activity.id"
                :title="activity.title"
                :image="activity.image"
                :people="activity.people"
                :description="activity.description"
                :price="activity.price"
                :timeDuration="activity.timeDuration"
                @delete="openDeleteModal"
            />
          </div>
          <!-- Modal de confirmación -->
          <ConfirmationModal
              :show="showDeleteModal"
              :publication="publicationToDelete"
              @confirm="confirmDelete"
              @cancel="closeDeleteModal"
          />
        </div>
      </div>

      <!-- Panel de Emprendedores -->
      <!-- Panel de Emprendedores -->
      <div v-if="activeTab === 1" class="tab-content entrepreneurs-panel">
        <h2>Emprendedores </h2>

        <!-- Estado de carga -->
        <div v-if="loadingEntrepreneurs" class="loading-state">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <p>Cargando emprendedores...</p>
        </div>

        <!-- Sin resultados -->
        <div v-else-if="entrepreneurs.length === 0" class="empty-state">
          <i class="pi pi-info-circle"></i>
          <p>No hay emprendedores disponibles en este momento</p>
        </div>

        <!-- Lista de emprendedores -->
        <div v-else class="entrepreneurs-grid">
          <div v-for="entrepreneur in entrepreneurs" :key="entrepreneur.id" class="entrepreneur-card-wrapper">
            <EntrepreneurCard
                :name="entrepreneur.username"
                :avatar="entrepreneur.avatar"
            />
          </div>
        </div>


        <!-- Panel de Aventureros -->
        <!-- Panel de Aventureros -->
        <div v-if="activeTab === 1" class="tab-content entrepreneurs-panel">
          <h2>Aventureros</h2>

          <!-- Estado de carga -->
          <div v-if="loadingAdventurer" class="loading-state">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            <p>Cargando aventureros...</p>
          </div>

          <!-- Sin resultados -->
          <div v-else-if="adventurers.length === 0" class="empty-state">
            <i class="pi pi-info-circle"></i>
            <p>No hay aventureros disponibles en este momento</p>
          </div>

          <!-- Lista de Aventureros -->
          <div v-else class="entrepreneurs-grid">
            <div v-for="adventurer in adventurers" :key="adventurer.id" class="entrepreneur-card-wrapper">
              <AdventurerCard
                  :name="adventurer.username"
                  :avatar="adventurer.avatar"
              />
            </div>
          </div>
      </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Estilos para carrusel mejorado */
.carousel-item {
  position: relative;
  height: 400px;
  width: 100%;
  overflow: hidden;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.carousel-item:hover img {
  transform: scale(1.05);
}

.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.8));
  color: white;
  padding: 30px 20px 20px;
  text-align: left;
}

.carousel-caption h3 {
  font-size: 1.6rem;
  margin-bottom: 10px;
  font-weight: 600;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.6);
}

.carousel-caption p {
  margin-bottom: 15px;
  font-size: 1rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
  max-width: 80%;
}

.explore-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.explore-btn:hover {
  background-color: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.25);
}

.carousel-loading, .carousel-empty {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-lighter);
  border-radius: 8px;
  color: var(--text-light);
}

.carousel-loading i, .carousel-empty i {
  font-size: 2rem;
  margin-bottom: 15px;
  color: var(--primary-color);
}

/* Estilos para los controles del carrusel */
:deep(.p-carousel .p-carousel-indicators .p-carousel-indicator.p-highlight button) {
  background-color: var(--primary-color);
}

:deep(.p-carousel .p-carousel-indicators .p-carousel-indicator button) {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

:deep(.p-carousel .p-carousel-content .p-carousel-prev,
.p-carousel .p-carousel-content .p-carousel-next) {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: var(--primary-color);
  margin: 0 10px;
  transition: all 0.2s ease;
}

:deep(.p-carousel .p-carousel-content .p-carousel-prev:hover,
.p-carousel .p-carousel-content .p-carousel-next:hover) {
  background-color: white;
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
}
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.home-header {
  text-align: center;
  margin: 30px auto 40px;
  max-width: 800px;
  position: relative;
  padding-bottom: 20px;
}

.home-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 2px;
}

.home-header h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 15px;
  color: var(--primary-color);
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.home-header p {
  color: var(--text-light);
  font-size: 1.2rem;
  line-height: 1.5;
  max-width: 600px;
  margin: 0 auto;
}

/* Estilos para el carrusel de imágenes */
.gallery-section {
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.gallery-item {
  width: 100%;
  height: 300px;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Estilos para pestañas de navegación */
.navigation-tabs {
  margin-bottom: 30px;
  padding: 0 20px;
}

:deep(.p-tabmenu .p-tabmenu-nav) {
  border: none;
  background-color: var(--primary-lighter);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(118, 85, 50, 0.1);
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem) {
  margin: 0 5px;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link) {
  border-radius: 8px;
  padding: 14px 24px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link) {
  background-color: var(--primary-color);
  color: #fff;
  box-shadow: 0 4px 8px rgba(118, 85, 50, 0.2);
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem:not(.p-highlight):not(.p-disabled):hover .p-menuitem-link) {
  background-color: rgba(118, 85, 50, 0.1);
  color: var(--primary-color);
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-icon) {
  margin-right: 8px;
  font-size: 1.1rem;
}
/* Estilos para el contenido principal */
.main-content {
  min-height: 400px;
}

.tab-content {
  animation: fadeIn 0.4s ease;
}


/* Cuadrícula para actividades */
.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 45px;
  margin-top: 20px;

}

.tab-content h2 {
  color: var(--primary-color);
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(118, 85, 50, 0.1);
  font-size: 1.8rem;
  font-weight: 700;
  position: relative;
}


.tab-content h2::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background-color: var(--primary-color);
}

.activity-card-wrapper {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.6s ease forwards;
}

/* Cuadrícula para emprendedores */
.entrepreneurs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.entrepreneur-card-wrapper {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}


@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 30px;
  color: var(--text-light);
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  margin: 20px 0;
}

.loading-state i, .empty-state i {
  font-size: 3rem;
  margin-bottom: 20px;
  color: var(--primary-light);
  opacity: 0.8;
}

.loading-state p, .empty-state p {
  font-size: 1.1rem;
  font-weight: 500;
}

.empty-state {
  background-color: #f9f5f0;
}

.empty-state button {
  margin-top: 15px;
  background-color: var(--primary-light);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.empty-state button:hover {
  background-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(118, 85, 50, 0.2);
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .home-header h1 {
    font-size: 28px;
  }

  .activities-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 25px;
  }

  .entrepreneurs-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 480px) {
  .activities-grid, .entrepreneurs-grid {
    grid-template-columns: 1fr;
  }
}
</style>