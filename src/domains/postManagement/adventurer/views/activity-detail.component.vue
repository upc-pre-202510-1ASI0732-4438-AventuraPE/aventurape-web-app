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
/* Contenedor principal */
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* Estado de carga */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--text-light);
}

.loading-state i {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: var(--primary-color);
}

/* Sección de detalle del producto */
.product-detail {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

/* Imagen del producto con control de tamaño */
.product-image {
  flex: 1 1 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
  height: 400px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

/* Información del producto */
.product-info {
  flex: 1 1 400px;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 1.8rem;
  margin: 0 0 15px;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1.2;
}

/* Metadatos de actividad */
.activity-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 25px;
  padding: 15px;
  background-color: var(--primary-lighter);
  border-radius: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 1rem;
  padding: 5px 0;
}

.meta-item i {
  margin-right: 8px;
  font-size: 1.1rem;
  color: var(--primary-light);
}

.meta-item.price {
  font-weight: bold;
  color: var(--primary-color);
  font-size: 1.2rem;
}

.product-description {
  font-size: 1.05rem;
  color: var(--text-light);
  margin-bottom: 25px;
  line-height: 1.6;
}

/* Sección de información adicional */
.additional-info {
  margin-top: 30px;
  border-radius: 12px;
  overflow: hidden;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-list li:last-child {
  border-bottom: none;
}

.info-list li i {
  color: var(--primary-color);
  font-size: 1.1rem;
  margin-right: 12px;
  margin-top: 3px;
  flex-shrink: 0;
}

.info-list li span {
  font-size: 1rem;
  color: var(--text-light);
  line-height: 1.5;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-header i {
  font-size: 1.2rem;
  color: var(--primary-color);
}

/* Sección de comentarios */
.reviews-section {
  padding-top: 30px;
  border-top: 2px solid #f0f0f0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  margin-bottom: 25px;
  color: var(--primary-color);
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.section-title i {
  font-size: 1.4rem;
}

/* Mejoras en el TabMenu */
.review-tabs {
  margin-bottom: 30px;
}

:deep(.p-tabmenu) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

:deep(.p-tabmenu .p-tabmenu-nav) {
  border: none;
  background-color: var(--primary-lighter);
  padding: 5px;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link) {
  border-radius: 6px;
  margin: 5px;
  padding: 15px 25px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link) {
  background-color: var(--primary-color);
  color: var(--white);
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem:not(.p-highlight):not(.p-disabled):hover .p-menuitem-link) {
  background-color: var(--primary-light);
  color: var(--white);
}

.tab-panel {
  min-height: 250px;
  padding: 10px 0;
}

/* Estilos para el panel */
:deep(.p-panel-header) {
  padding: 15px !important;
  background-color: var(--primary-lighter) !important;
}

:deep(.p-panel-content) {
  padding: 20px !important;
  background-color: var(--white) !important;
}

:deep(.p-panel) {
  border-radius: 8px !important;
  overflow: hidden !important;
  box-shadow: var(--shadow) !important;
}

:deep(.p-panel-header-icon) {
  margin-left: auto;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

:deep(.p-panel-header-icon:hover) {
  background-color: rgba(0,0,0,0.05);
}

/* Estilos responsivos */
@media (max-width: 992px) {
  .product-detail {
    flex-direction: column;
  }

  .product-image {
    max-height: 350px;
  }
}

@media (max-width: 768px) {
  .product-title {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .activity-meta {
    flex-direction: column;
    gap: 10px;
  }

  :deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link) {
    padding: 12px 20px;
  }

  .product-image {
    height: 300px;
  }
}

@media (max-width: 576px) {
  .product-image {
    height: 250px;
  }

  .meta-item {
    width: 100%;
  }

  :deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link) {
    padding: 10px 15px;
    font-size: 0.9rem;
  }

  .info-list li span {
    font-size: 0.9rem;
  }
}
</style>