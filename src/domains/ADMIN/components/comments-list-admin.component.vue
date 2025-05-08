<script>
export default {
  name: 'CommentsListAdmin',
  props: {
    reviews: {
      type: Array,
      default: () => []
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
    }

  }
};
</script>

<template>
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
          <button class="action-btn" @click="$emit('delete-comment', review.id)">
            <i class="pi pi-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
    <div v-else class="no-reviews">
      <i class="pi pi-comments"></i>
      <p>No hay comentarios todavía. ¡Sé el primero en compartir tu experiencia!</p>
    </div>
  </div>
</template>

<style scoped>
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
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 13px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

.action-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

.action-btn i {
  font-size: 14px;
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
</style>