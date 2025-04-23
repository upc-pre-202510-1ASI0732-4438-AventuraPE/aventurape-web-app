<script>
import ActivityCard from "@/domains/postManagement/adventurer/components/activity-card.component.vue";
import EntrepreneurCard from "@/domains/postManagement/adventurer/components/entrepreneur-card.component.vue";
import Carousel from "primevue/carousel";
import TabMenu from "primevue/tabmenu";

export default {
  name: "HomeAdventurer",
  components: {
    ActivityCard,
    EntrepreneurCard,
    Carousel,
    TabMenu
  },
  data() {
    return {
      // Control de pestañas
      activeTab: 0,
      tabs: [
        { label: 'Aventuras', icon: 'pi pi-compass' },
        { label: 'Emprendedores', icon: 'pi pi-users' }
      ],

      // Imágenes para el carrusel
      galleryImages: [
        { id: 1, src: 'https://picsum.photos/800/300?random=1', alt: 'Aventura en montaña' },
        { id: 2, src: 'https://picsum.photos/800/300?random=2', alt: 'Rafting en río' },
        { id: 3, src: 'https://picsum.photos/800/300?random=3', alt: 'Senderismo en bosque' },
        { id: 4, src: 'https://picsum.photos/800/300?random=4', alt: 'Escalada en roca' },
        { id: 5, src: 'https://picsum.photos/800/300?random=5', alt: 'Paracaidismo' }
      ],

      // Datos de actividades
      activities: [
        {
          id: 1,
          title: 'Senderismo en Sierra Nevada',
          image: 'https://picsum.photos/300/200?random=11',
          people: 12
        },
        {
          id: 2,
          title: 'Kayak en Río Genil',
          image: 'https://picsum.photos/300/200?random=12',
          people: 8
        },
        {
          id: 3,
          title: 'Escalada en El Chorro',
          image: 'https://picsum.photos/300/200?random=13',
          people: 6
        },
        {
          id: 4,
          title: 'Buceo en Cabo de Gata',
          image: 'https://picsum.photos/300/200?random=14',
          people: 10
        }
      ],

      // Datos de emprendedores
      entrepreneurs: [
        {
          id: 101,
          name: 'Aventuras Sierra',
          avatar: 'https://picsum.photos/64/64?random=21',
        },
        {
          id: 102,
          name: 'Acuática Experiencias',
          avatar: 'https://picsum.photos/64/64?random=22',
        },
        {
          id: 103,
          name: 'Vertical Climbing',
          avatar: 'https://picsum.photos/64/64?random=23',
        }
      ]
    };
  },
  methods: {
    changeTab(index) {
      this.activeTab = index;
    }
  }
};
</script>

<template>
  <div class="home-container">
    <!-- Header con título -->
    <header class="home-header">
      <h1>Descubre tu próxima aventura</h1>
      <p>Explora actividades emocionantes y conoce a emprendedores locales</p>
    </header>

    <!-- Carrusel de imágenes autoplay -->
    <div class="gallery-section">
      <Carousel
          :value="galleryImages"
          :numVisible="1"
          :numScroll="1"
          :autoplayInterval="3000"
          :circular="true"
          :autoplay="true">
        <template #item="slotProps">
          <div class="gallery-item">
            <img :src="slotProps.data.src" :alt="slotProps.data.alt" />
          </div>
        </template>
      </Carousel>
    </div>

    <!-- Navegación por pestañas -->
    <div class="navigation-tabs">
      <TabMenu :model="tabs" v-model:activeIndex="activeTab" />
    </div>

    <!-- Contenido principal -->
    <main class="main-content">
      <!-- Panel de Aventuras -->
      <div v-if="activeTab === 0" class="tab-content activities-panel">
        <h2>Aventuras disponibles</h2>
        <div class="activities-grid">
          <div v-for="activity in activities" :key="activity.id" class="activity-card-wrapper">
            <ActivityCard
                :title="activity.title"
                :image="activity.image"
                :people="activity.people"
            />
          </div>
        </div>
      </div>

      <!-- Panel de Emprendedores -->
      <div v-if="activeTab === 1" class="tab-content entrepreneurs-panel">
        <h2>Emprendedores destacados</h2>
        <div class="entrepreneurs-grid">
          <div v-for="entrepreneur in entrepreneurs" :key="entrepreneur.id" class="entrepreneur-card-wrapper">
            <EntrepreneurCard
                :name="entrepreneur.name"
                :avatar="entrepreneur.avatar"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.home-header {
  text-align: center;
  margin-bottom: 30px;
}

.home-header h1 {
  color: #3a7539;
  font-size: 36px;
  margin-bottom: 10px;
}

.home-header p {
  color: #666;
  font-size: 18px;
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
}

:deep(.p-tabmenu .p-tabmenu-nav) {
  border: none;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 5px;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link) {
  border-radius: 6px;
  margin: 0 5px;
  padding: 12px 20px;
  font-weight: 500;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link) {
  background-color: #3a7539;
  color: #fff;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem:not(.p-highlight):not(.p-disabled):hover .p-menuitem-link) {
  background-color: #e9ecef;
  color: #3a7539;
}

/* Estilos para el contenido principal */
.main-content {
  min-height: 400px;
}

.tab-content {
  animation: fadeIn 0.4s ease;
}

.tab-content h2 {
  color: #3a7539;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

/* Cuadrícula para actividades */
.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 45px;
}

.activity-card-wrapper {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.activity-card-wrapper:hover {
  transform: translateY(-5px);
}

/* Cuadrícula para emprendedores */
.entrepreneurs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.entrepreneur-card-wrapper {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.entrepreneur-card-wrapper:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
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




}
</style>