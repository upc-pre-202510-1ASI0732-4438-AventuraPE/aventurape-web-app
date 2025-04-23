<script>
import Panel from 'primevue/panel';
import TabMenu from 'primevue/tabmenu';
import MakeComment from '@/domains/postManagement/adventurer/components/make-comment.component.vue';
import CommentsList from '@/domains/postManagement/adventurer/components/comments-list.component.vue';
import { ActivityApiService } from '@/domains/postManagement/shared/services/activity-api.service.js';
import { CommentEntity } from '@/domains/postManagement/shared/models/comment.entity.js';

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
        id: null,
        nameActivity: '',
        description: '',
        cantPeople: 0,
        timeDuration: 0,
        entrepreneurId: null,
        image: '',
        cost: 0,
        reviews: []
      },
      loading: true,
      activityApiService: new ActivityApiService()
    };
  },

  async mounted() {
    await this.fetchActivityDetails();
    await this.fetchComments();
  },

  methods: {
    // Añadir estos métodos
    async fetchActivityDetails() {
      try {
        const id = this.$route.params.id;

        // Mostrar estado de carga
        this.loading = true;

        const response = await this.activityApiService.getActivityById(id);

        // Mapear los datos del backend a nuestro modelo local
        this.activity = {
          id: response.data.Id,
          title: response.data.nameActivity,
          description: response.data.description,
          capacity: response.data.cantPeople,
          availableSpots: response.data.cantPeople, // Ajustamos según disponibilidad real
          price: response.data.cost,
          duration: {
            hours: Math.floor(response.data.timeDuration / 60),
            minutes: response.data.timeDuration % 60
          },
          image: response.data.image || 'https://primefaces.org/cdn/primevue/images/usercard.png',
          features: [], // Se pueden agregar características estáticas o de otro endpoint
          entrepreneurId: response.data.entrepreneurId,
          reviews: [] // Los comentarios se cargarán por separado
        };

        // Habilitar la sección de comentarios solo si los datos de la actividad se cargaron
        this.activeTabIndex = 0;
        this.loading = false;
      } catch (error) {
        console.error('Error al obtener detalles de la actividad:', error);
        this.loading = false;
      }
    },

    async fetchComments() {
      try {
        const id = this.$route.params.id;
        const response = await this.activityApiService.getCommentsByActivityId(id);

        // Caché local para evitar solicitudes duplicadas
        const userCache = {};
        const commentsWithUserNames = [];

        // Procesar cada comentario
        for (const comment of response.data) {
          const userId = comment.adventureId;
          let userName;

          // Verificar si el usuario ya está en caché
          if (!userCache[userId]) {
            try {
              // Obtener datos del usuario desde la API
              const userResponse = await this.activityApiService.getUserById(userId);

              // Si hay respuesta exitosa, usar el nombre real
              if (userResponse && userResponse.data && userResponse.data.username) {
                userName = userResponse.data.username;
              } else {
                userName = `Usuario ${userId}`;
              }

              // Almacenar en caché
              userCache[userId] = userName;
            } catch (error) {
              console.error(`Error al obtener datos del usuario ${userId}:`, error);
              userName = `Usuario ${userId}`;
              userCache[userId] = userName;
            }
          } else {
            // Usar el nombre de usuario del caché
            userName = userCache[userId];
          }

          // Agregar comentario con nombre real
          commentsWithUserNames.push({
            id: comment.id,
            userName: userName,
            comment: comment.content,
            rating: comment.rating,
            adventureId: comment.adventureId,
            date: new Date().toISOString() // Temporal hasta que tengas fechas reales
          });
        }

        // Actualizar los comentarios en la actividad
        this.activity.reviews = commentsWithUserNames;

      } catch (error) {
        console.error('Error al obtener comentarios:', error);
      }
    },
    async addReview(newReview) {
      try {
        // Obtener ID del usuario actual del store de autenticación
        const userId = localStorage.getItem('userId') || 1;
        const username = localStorage.getItem('username');

        // Crear objeto de comentario según formato API
        const comment = {
          publicationId: this.activity.id,
          content: newReview.content,
          rating: newReview.rating,
          adventureId: parseInt(userId)
        };

        await this.activityApiService.postComment(this.activity.id, comment);

        // Agregar el comentario localmente para evitar una nueva llamada API
        this.activity.reviews.unshift({
          id: Date.now(), // ID temporal hasta obtener uno real
          userName: username || `Usuario ${userId}`,
          comment: newReview.content,
          rating: newReview.rating,
          adventureId: parseInt(userId),
          date: new Date().toISOString()
        });

        // Cambiar a la pestaña de comentarios
        this.activeTabIndex = 0;

      } catch (error) {
        console.error('Error al publicar comentario:', error);
      }
    }
  }
};
</script>

<template>
  <div class="product-detail-container">
    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p>Cargando detalles de la actividad...</p>
    </div>

    <div v-else>
      <!-- Sección principal de detalle -->
      <div class="product-detail">
        <div class="product-image">
          <img :src="activity.image" :alt="activity.title" />
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

          <!--INFORMACION IMPORTANTE-->
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
        </div>
      </div>


      <!-- Sección de Comentarios -->
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