<script>
import Panel from 'primevue/panel';
import TabMenu from 'primevue/tabmenu';
import MakeComment from '@/domains/postManagement/adventurer/components/make-comment.component.vue';
import CommentsList from '@/domains/postManagement/adventurer/components/comments-list.component.vue';

export default {
  name: 'DetailActivity',
  components: {
    MakeComment,
    CommentsList,
    Panel,
    TabMenu
  },
  data() {
    return {
      selectedColor: 'black',
      activeTabIndex: 0,
      reviewTabs: [
        {
          label: 'Ver reseñas',
          icon: 'pi pi-list'
        },
        {
          label: 'Escribir reseña',
          icon: 'pi pi-pencil'
        }
      ],
      activity: {
        // tus datos actuales...
        id: 1,
        title: 'Excursión Montaña Aventura',
        image: '/images/mountain-activity.jpg',
        description: 'Una increíble experiencia en la montaña con guías profesionales. Disfruta de paisajes impresionantes mientras aprendes sobre la flora y fauna local.',
        capacity: 15,
        availableSpots: 8,
        price: 75.99,
        duration: {
          hours: 5,
          minutes: 30
        },
        features: [
          'Guía profesional incluido',
          'Equipo de seguridad completo',
          'Refrigerio durante la actividad'
        ],
        colors: ['red', 'white', 'black'],
        shipping: 'FREE',
        buttonText: 'Reservar Ahora',
        reviews: []
      }
    };
  },
  methods: {
    addReview(newReview) {
      this.activity.reviews.push(newReview);
      this.activeTabIndex = 0; // Cambiar a la pestaña de ver reseñas después de publicar
    }
  }
};
</script>
<template>
  <div class="product-detail-container">
    <!-- Sección principal de detalle -->
    <div class="product-detail">
      <div class="product-image">
        <img alt="user header" src="https://primefaces.org/cdn/primevue/images/usercard.png" />
        <!--<img :src="activity.image" :alt="activity.title" />-->
      </div>

      <!-- Información del producto -->
      <div class="product-info">
        <h2 class="product-title">{{ activity.title }}</h2>

        <div class="activity-meta">
          <div class="meta-item">
            <i class="pi pi-clock"></i>
            <span>{{ activity.duration.hours }}h {{ activity.duration.minutes > 0 ? activity.duration.minutes + 'min' : '' }}</span>
          </div>
          <div class="meta-item">
            <i class="pi pi-users"></i>
            <span>{{ activity.availableSpots }} plazas disponibles de {{ activity.capacity }}</span>
          </div>
          <div class="meta-item price">
            <i class="pi pi-tag"></i>
            <span>{{ activity.price.toFixed(2) }} €</span>
          </div>
        </div>

        <p class="product-description">
          {{ activity.description }}
        </p>


      </div>
    </div>
    <!-- Sección de Informacion Importante -->
    <div class="additional-info">
      <Panel header="Información importante" toggleable :toggleIcon="{ on: 'pi pi-minus', off: 'pi pi-plus' }">
        <template #header>
          <div class="panel-header">
            <i class="pi pi-info-circle"></i>
            <span>Información importante</span>
          </div>
        </template>
        <ul class="info-list">
          <li>
            <i class="pi pi-check-circle"></i>
            <span>Esta actividad incluye todo lo necesario para que disfrutes al máximo.</span>
          </li>
          <li>
            <i class="pi pi-info-circle"></i>
            <span>No olvides traer ropa cómoda y muchas ganas de divertirte.</span>
          </li>
          <li>
            <i class="pi pi-calendar"></i>
            <span>¡Recuerda que en la actividad  podrás conocer a mucha gente nueva!</span>
          </li>
          <li>
            <i class="pi pi-users"></i>
            <span>No olvides traer tu cámara para capturar los mejores momentos</span>
          </li>
        </ul>
      </Panel>
    </div>
    <!-- Sección de Comentarios con TabMenu -->
    <div class="reviews-section">
      <h3 class="section-title">
        Comentarios
      </h3>

      <TabMenu :model="reviewTabs" v-model:activeIndex="activeTabIndex" class="review-tabs" />

      <div class="reviews-content">
        <!-- Panel de Comentarios -->
        <div v-if="activeTabIndex === 0" class="tab-panel">
          <CommentsList :reviews="activity.reviews" />
        </div>

        <!-- Panel de Formulario -->
        <div v-if="activeTabIndex === 1" class="tab-panel">
          <MakeComment @submit-review="addReview" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Mantén tus estilos existentes */

  /* Estilos para el TabMenu */
.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  margin-bottom: 20px;
  color: #3a7539;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.section-title i {
  font-size: 22px;
}

.review-tabs {
  margin-bottom: 20px;
}

:deep(.p-tabmenu .p-tabmenu-nav) {
  border: none;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link) {
  color: #3a7539;
  border-color: #3a7539;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem:not(.p-highlight):not(.p-disabled):hover .p-menuitem-link) {
  background-color: #f5f5f5;
  color: #2a4a29;
}

.tab-panel {
  min-height: 200px;
}

.no-reviews i {
  font-size: 48px;
  color: #ccc;
  margin-bottom: 15px;
}

.no-reviews p {
  color: #666;
  font-size: 16px;
}

.tab-btn i {
  font-size: 14px;
}

/* Estilos de Importante */
.product-description {
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
}
.additional-info h3 {
  margin-bottom: 10px;
  font-size: 20px;
  color: #333;
}
.additional-info p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.additional-info {
  margin-top: 30px;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.info-header i {
  font-size: 24px;
  margin-right: 10px;
}

.info-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li:last-child {
  border-bottom: none;
}

.info-list li i {
  color: #3a7539;
  font-size: 16px;
  margin-right: 12px;
  margin-top: 3px;
}

.info-list li span {
  font-size: 15px;
  color: #555;
  line-height: 1.5;
}

.info-footer i {
  color: #555;
  margin-right: 10px;
}

.info-footer span {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.panel-header {
   display: flex;
   align-items: center;
   gap: 10px;
 }

.panel-header i {
  font-size: 18px;
  color: #2a4a29;
}

:deep(.p-panel-header) {
  padding: 15px !important;
  background-color: #f5f5f5 !important;
}

:deep(.p-panel-content) {
  padding: 20px !important;
  background-color: #ffffff !important;
}

:deep(.p-panel) {
  border-radius: 8px !important;
  overflow: hidden !important;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1) !important;
}

:deep(.p-panel-header-icon) {
  margin-left: auto;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .info-list li {
    padding: 10px 0;
  }

  .info-list li span {
    font-size: 14px;
  }
}

/* Estilos de la sección de detalles del producto */
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}
.product-detail {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}
.product-image {
  flex: 0 0 50%;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}
.product-info {
  flex: 0 0 45%;
  display: flex;
  flex-direction: column;
}
.product-title {
  font-size: 24px;
  margin: 0 0 10px;
  font-weight: bold;
}
.product-features li {
  margin-bottom: 8px;
}

/* Estilos de la sección de comentarios */
.reviews-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
}
.reviews-nav {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}
.tab-btn {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}
.tab-btn.active {
  font-weight: bold;
  border-bottom: 2px solid #000;
}


/*estilos de los datos*/
.activity-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.meta-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}
.meta-item i {
  margin-right: 5px;
  color: #888;
}
.meta-item.price {
  font-weight: bold;
  color: #333;
}

@media (max-width: 768px) {
  .product-detail {
    flex-direction: column;
  }

  .product-image, .product-info {
    flex: 0 0 100%;
  }
}
</style>