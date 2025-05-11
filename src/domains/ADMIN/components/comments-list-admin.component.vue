<script>
import emailjs from '@emailjs/browser';

export default {
  name: 'CommentsListAdmin',
  props: {
    reviews: {
      type: Array,
      default: () => []
    },
    activityName: {
      type: String,
      default: 'la actividad'
    }
  },
  emits: ['delete-comment'], // Define the emit event properly
  data() {
    return {
      showConfirmationModal: false,
      commentToDelete: null,
      isDeleting: false
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('es-ES', options);
    },
    getRandomColor(name) {
      const colors = [
        '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE',
        '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE'
      ];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    },
    getInitials(name) {
      if (!name) return '?';
      return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
    },
    confirmDelete(review) {
      this.commentToDelete = review;
      this.showConfirmationModal = true;
    },
    cancelDelete() {
      this.commentToDelete = null;
      this.showConfirmationModal = false;
    },
    async handleDeleteConfirm() {
      if (this.commentToDelete) {
        try {
          // Show loading state
          this.isDeleting = true;

          // Send notification email (but don't wait for it)
          this.sendDeletionEmail().catch(err => {
            console.error('Email notification failed, but continuing with deletion:', err);
          });

          console.log('Emitting delete-comment event with ID:', this.commentToDelete.id);

          // Emit the delete event with the comment ID
          this.$emit('delete-comment', this.commentToDelete.id);

          // Close the modal
          this.showConfirmationModal = false;

          // Give some time for the API call to complete
          setTimeout(() => {
            this.isDeleting = false;
            this.commentToDelete = null;
          }, 1000);

        } catch (error) {
          console.error('Error during comment deletion process:', error);
          this.isDeleting = false;
          this.showConfirmationModal = false;
          this.commentToDelete = null;
        }
      }
    },
    async sendDeletionEmail() {
      try {
        // First, get the user email using the comment's adventureId
        let userEmail = '';

        if (this.commentToDelete.adventureId) {
          const activityApiService = new (await import('@/domains/postManagement/shared/services/activity-api.service.js')).ActivityApiService();

          try {
            const userResponse = await activityApiService.getUserById(this.commentToDelete.adventureId);
            if (userResponse && userResponse.data && userResponse.data.email) {
              userEmail = userResponse.data.email;
            }
          } catch (error) {
            console.error('Error fetching user email:', error);
          }
        }

        // Prepare email template parameters with the retrieved email
        const templateParams = {
          to_email: userEmail, // Now we have the actual email
          to_name: this.commentToDelete.userName || 'Usuario',
          activity_name: this.activityName || 'la actividad',
          subject: 'Tu comentario ha sido eliminado',
          message: `Tu comentario en la actividad "${this.activityName}" ha sido eliminado por un administrador.`
        };

        console.log('Sending email with params:', templateParams);

        // Only send the email if we have a valid recipient
        if (userEmail) {
          // Send email using EmailJS
          const response = await emailjs.send(
              'service_w4b26t5',
              'template_comentarios_ape',
              templateParams
          );
          console.log('Email enviado correctamente:', response);
        } else {
          console.warn('No se pudo enviar el email: dirección de correo no disponible');
        }
      } catch (error) {
        console.error('Error al enviar email de notificación:', error);
      }
    }
  }
};
</script>

<template>
  <!-- Add a loading overlay that appears when deleting -->
  <div v-if="isDeleting" class="deletion-overlay">
    <div class="spinner">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <span>Eliminando comentario...</span>
    </div>
  </div>

  <div class="reviews-list">
    <div v-if="reviews && reviews.length > 0">
      <div v-for="(review, index) in reviews" :key="index" class="review-item">
        <div class="review-header">
          <div class="user-info">
            <div v-if="review.userAvatar" class="user-avatar">
              <img :src="review.userAvatar" alt="Avatar de usuario">
            </div>
            <div v-else class="user-avatar user-avatar-initials"
                 :style="{ backgroundColor: getRandomColor(review.userName) }">
              {{ getInitials(review.userName) }}
            </div>
            <div class="name-and-date">
              <span class="user-name">{{ review.userName }}</span>
              <span class="date">{{ formatDate(review.date) }}</span>
            </div>
          </div>
          <div class="rating">
            <span class="stars">
              <span v-for="i in 5" :key="i" :class="['star', { 'filled': i <= review.rating }]">★</span>
            </span>
          </div>
        </div>
        <div class="review-content">
          <p>{{ review.comment }}</p>
        </div>
        <div class="review-footer">
          <button class="action-btn" @click="confirmDelete(review)">
            <i class="pi pi-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
    <div v-else class="no-reviews">
      <i class="pi pi-comments"></i>
      <p>No hay comentarios todavía.</p>
    </div>
  </div>

  <!-- Modal de confirmación -->
  <div v-if="showConfirmationModal" class="modal-backdrop" style="z-index: 9999;">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">Confirmar Eliminación</h2>
        <button @click="cancelDelete" class="close-button">
          <i class="pi pi-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="confirmation-message">
          <i class="pi pi-exclamation-triangle warning-icon"></i>
          <p>¿Estás seguro de que deseas eliminar este comentario?</p>
          <p class="warning-text">Esta acción no se puede deshacer y se notificará al usuario.</p>
        </div>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn-secondary">Cancelar</button>
          <button @click="handleDeleteConfirm" class="btn-danger">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.deletion-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.reviews-list {
  padding: 10px 0;
}

.review-item {
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.review-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  font-weight: bold;
}

.name-and-date {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.date {
  font-size: 12px;
  color: #777;
  margin-top: 2px;
}

.rating {
  margin-left: 10px;
}

.stars {
  color: #ddd;
  font-size: 18px;
  letter-spacing: 2px;
}

.star.filled {
  color: #ffc107;
}

.review-content {
  margin: 15px 0;
  line-height: 1.6;
  color: #444;
  font-size: 15px;
}

.review-content p {
  margin: 0;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.review-actions {
  display: flex;
  gap: 15px;
}

.action-btn {
  background-color: #fff0f0;
  color: var(--error-color);
  border: 1px solid var(--error-color);
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-btn:hover {
  background-color: #ffe5e5;
}

.no-reviews {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 8px;
}

.no-reviews i {
  font-size: 32px;
  color: #ccc;
  margin-bottom: 10px;
}

.no-reviews p {
  margin: 0;
  font-size: 15px;
  max-width: 300px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .review-header {
    flex-direction: column;
  }

  .rating {
    margin-left: 0;
    margin-top: 10px;
  }
}

/* Estilos para el modal de confirmación */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 10px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  animation: bounceIn 0.3s ease-out;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  70% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #eee;
}

.modal-title {
  color: var(--error-color);
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.close-button:hover {
  color: var(--error-color);
}

.modal-body {
  padding: 25px;
}

.confirmation-message {
  text-align: center;
  margin-bottom: 25px;
}

.warning-icon {
  font-size: 48px;
  color: var(--error-color);
  margin-bottom: 15px;
}

.warning-text {
  color: var(--error-color);
  font-weight: 500;
  margin-top: 10px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.btn-secondary {
  background-color: #e9e9e9;
  color: var(--text-dark);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background-color: #ddd;
}

.btn-danger {
  background-color: var(--error-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-danger:hover {
  background-color: #e53935;
  box-shadow: 0 4px 12px rgba(229, 57, 53, 0.3);
}
</style>