<script>
import Panel from 'primevue/panel';
import TabMenu from 'primevue/tabmenu';
import { ActivityApiService } from '@/domains/postManagement/shared/services/activity-api.service.js';
import { CommentEntity } from '@/domains/postManagement/shared/models/comment.entity.js';
import CommentsListAdmin from "@/domains/ADMIN/components/comments-list-admin.component.vue";

export default {
  name: 'DetailActivityAdmin',
  components: {
    CommentsListAdmin,
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
    async deleteComment(commentId) {
      try {
        const publicationId = this.activity.id;

        if (!publicationId || !commentId) {
          throw new Error('Faltan valores para eliminar el comentario.');
        }

        // Add loading indicator
        this.deletingCommentId = commentId;

        console.log('Datos enviados para eliminar comentario:', { publicationId, commentId });

        // Call the service to delete the comment
        const response = await this.activityApiService.deleteComment(publicationId, commentId);
        console.log('API response for comment deletion:', response);

        if (response) {
          // Immediately update UI by filtering out the deleted comment
          this.activity.reviews = this.activity.reviews.filter(comment => comment.id !== commentId);
          console.log('Comentario eliminado exitosamente');

          // Show success message
          this.$toast?.add({
            severity: "success",
            summary: "Éxito",
            detail: "El comentario ha sido eliminado",
            life: 3000,
          });
        }
      } catch (error) {
        console.error('Error al eliminar el comentario:', error.response?.data || error.message);
        // Show error message to user
        this.$toast?.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudo eliminar el comentario",
          life: 3000,
        });
      } finally {
        this.deletingCommentId = null; // Clear loading state
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
              <span>{{ activity.availableSpots }} plazas disponibles</span>
            </div>
            <div class="meta-item price">
              <span>S/. {{ activity.price.toFixed(2) }}</span>
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
            <CommentsListAdmin
              :reviews="activity.reviews"
              :activityName="activity.title"
              @delete-comment="deleteComment"
            />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal con estilo mejorado */
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* Estado de carga con animación suave */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: var(--primary-light);
}

.loading-state i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: var(--primary-color);
}

/* Sección de detalle del producto con efecto de elevación */
.product-detail {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  padding: 10px;
}

/* Imagen con efecto de destaque al pasar el mouse */
.product-image {
  flex: 1 1 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(118, 85, 50, 0.1);
  height: 450px;
  transition: all 0.3s ease;
}

.product-image:hover img {
  transform: scale(1.03);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

/* Información del producto con mejor espaciado */
.product-info {
  flex: 1 1 400px;
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
}

.product-title {
  font-size: 2.2rem;
  margin: 0 0 20px;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1.2;
  position: relative;
  padding-bottom: 15px;
}

.product-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background: var(--primary-light);
  border-radius: 2px;
}

/* Metadatos de actividad con iconos mejorados */
.activity-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 25px;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(118, 85, 50, 0.08);
  border: 1px solid rgba(118, 85, 50, 0.1);
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 1.05rem;
  padding: 8px 15px;
  background-color: var(--primary-lighter);
  border-radius: 30px;
  transition: all 0.3s ease;
}

.meta-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(118, 85, 50, 0.1);
}

.meta-item i {
  margin-right: 10px;
  font-size: 1.2rem;
  color: var(--primary-color);
}

.meta-item.price {
  font-weight: bold;
  color: white;
  font-size: 1.2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
}

.product-description {
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 30px;
  line-height: 1.7;
  padding: 5px 10px;
  border-left: 3px solid var(--primary-light);
  background-color: rgba(255, 255, 255, 0.7);
}

/* Sección de información adicional inicialmente minimizada */
.additional-info {
  margin-top: 30px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.additional-info:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(118, 85, 50, 0.12);
}

/* Lista de información con mejor visualización */
.info-list {
  list-style: none;
  padding: 10px 5px;
  margin: 0;
  background-color: white;
  border-radius: 8px;
}

.info-list li {
  display: flex;
  align-items: flex-start;
  padding: 15px 10px;
  border-bottom: 1px solid rgba(118, 85, 50, 0.1);
  transition: all 0.3s ease;
}

.info-list li:hover {
  background-color: var(--primary-lighter);
  transform: translateX(5px);
}

.info-list li:last-child {
  border-bottom: none;
}

.info-list li i {
  color: var(--primary-color);
  font-size: 1.2rem;
  margin-right: 15px;
  margin-top: 3px;
  flex-shrink: 0;
}

.info-list li span {
  font-size: 1.05rem;
  color: var(--text-light);
  line-height: 1.5;
}

/* Encabezado del panel mejorado */
.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 5px 0;
}

.panel-header i {
  font-size: 1.3rem;
  color: var(--primary-color);
}

.panel-header span {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color);
}

/* Sección de comentarios con mejor separación */
.reviews-section {
  padding-top: 40px;
  margin-top: 30px;
  border-top: 2px dashed rgba(118, 85, 50, 0.2);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: var(--primary-color);
  position: relative;
  padding-bottom: 15px;
}

.section-title::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100px;
  height: 4px;
  background: var(--primary-light);
  border-radius: 2px;
}

/* Mejoras en el TabMenu con aspecto profesional */
.review-tabs {
  margin-bottom: 30px;
}

:deep(.p-tabmenu) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: none;
}

:deep(.p-tabmenu .p-tabmenu-nav) {
  /* Eliminamos el fondo blanco y los bordes */
  background-color: transparent !important;
  border: none !important;
  padding: 8px 0;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link) {
  border-radius: 30px;
  margin: 5px;
  padding: 15px 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  /* Agregamos un fondo sutil a los botones individuales */
  background-color: white;
  border: 1px solid rgba(118, 85, 50, 0.1);
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link) {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  box-shadow: 0 5px 15px rgba(118, 85, 50, 0.2);
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem:not(.p-highlight):not(.p-disabled):hover .p-menuitem-link) {
  background-color: white;
  color: var(--primary-color);
  transform: translateY(-3px);
}

.tab-panel {
  min-height: 250px;
  padding: 10px 0;
}

/* Estilos para el panel minimizado por defecto */
:deep(.p-panel-header) {
  padding: 18px !important;
  background: linear-gradient(145deg, white, var(--primary-lighter)) !important;
  transition: all 0.3s ease;
}

:deep(.p-panel-header:hover) {
  background: linear-gradient(145deg, var(--primary-lighter), white) !important;
}

:deep(.p-panel-content) {
  padding: 20px !important;
  background-color: white !important;
}

:deep(.p-panel) {
  border-radius: 12px !important;
  overflow: hidden !important;
  box-shadow: 0 8px 20px rgba(118, 85, 50, 0.08) !important;
  border: 1px solid rgba(118, 85, 50, 0.1) !important;
  transition: all 0.3s ease !important;
}

:deep(.p-panel:hover) {
  box-shadow: 0 12px 28px rgba(118, 85, 50, 0.12) !important;
}

:deep(.p-panel-toggleable .p-panel-header) {
  cursor: pointer;
}

:deep(.p-panel-header-icon) {
  margin-left: auto;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(118, 85, 50, 0.1);
  color: var(--primary-color) !important;
  transition: all 0.3s ease;
}

:deep(.p-panel-header-icon:hover) {
  background-color: var(--primary-color);
  color: white !important;
  transform: rotate(180deg);
}

/* Estilos responsivos */
@media (max-width: 992px) {
  .product-detail {
    flex-direction: column;
    padding: 20px 15px;
  }

  .product-image {
    max-height: 400px;
  }

  .product-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .product-title {
    font-size: 1.8rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .activity-meta {
    padding: 15px;
    gap: 10px;
  }

  .meta-item {
    padding: 6px 12px;
    font-size: 0.95rem;
  }

  :deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link) {
    padding: 12px 20px;
  }

  .product-image {
    height: 320px;
  }

  .product-description {
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .product-image {
    height: 280px;
  }

  .meta-item {
    width: 100%;
  }

  .product-title {
    font-size: 1.6rem;
  }

  .product-title::after {
    width: 40px;
    height: 3px;
  }

  :deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link) {
    padding: 10px 15px;
    font-size: 0.9rem;
  }

  .info-list li span {
    font-size: 0.95rem;
  }

  .panel-header span {
    font-size: 1.1rem;
  }
}
</style>