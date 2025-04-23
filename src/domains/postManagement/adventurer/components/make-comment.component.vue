<script>
export default {
  name: 'MakeComment',
  data() {
    return {
      reviewData: {
        // El nombre de usuario se obtendrá de la lógica de datos
        rating: 0,
        comment: '',
        date: null
      },
      maxLength: 500,
      hoverRating: 0
    };
  },
  computed: {
    remainingChars() {
      return this.maxLength - this.reviewData.comment.length;
    }
  },
  methods: {
    setRating(rating) {
      this.reviewData.rating = rating;
    },
    setHoverRating(rating) {
      this.hoverRating = rating;
    },
    resetHoverRating() {
      this.hoverRating = 0;
    },
    getStarClass(position) {
      return {
        'star-hover': this.hoverRating >= position && this.hoverRating > 0,
        'star-selected': this.reviewData.rating >= position && this.hoverRating === 0,
        'star-selected-and-hover': this.reviewData.rating >= position && this.hoverRating > 0
      };
    },
    submitReview() {
      if (this.reviewData.rating > 0 && this.reviewData.comment) {
        const newReview = {
          ...this.reviewData,
          // Nombre temporal hasta implementar lógica de usuario
          userName: 'Usuario Actual',
          date: new Date().toISOString()
        };
        this.$emit('submit-review', newReview);
        this.reviewData = {
          rating: 0,
          comment: '',
          date: null
        };
      }
    }
  }
};
</script>

<template>
  <div class="make-review">
    <h3 class="review-title">
      Comparte tu experiencia
    </h3>
    <form @submit.prevent="submitReview" class="review-form">
      <div class="form-group">
        <label>¿Cómo calificarías esta actividad?</label>
        <div class="rating-selector">
          <span
              v-for="star in 5"
              :key="star"
              @click="setRating(star)"
              @mouseenter="setHoverRating(star)"
              @mouseleave="resetHoverRating"
              class="rating-star"
              :class="getStarClass(star)"
          >
            ★
          </span>
          <span class="rating-text">
            {{ reviewData.rating ? `${reviewData.rating} de 5 estrellas` : 'Selecciona una calificación' }}
          </span>
        </div>
      </div>

      <div class="form-group">
        <label for="reviewComment">
          <i class="pi pi-comment"></i>
          Tu comentario
        </label>
        <div class="textarea-container">
          <textarea
              id="reviewComment"
              v-model="reviewData.comment"
              required
              placeholder="¿Qué te pareció esta actividad? ¿La recomendarías a otros aventureros?"
              rows="4"
              :maxlength="maxLength"
              class="styled-textarea"
          ></textarea>
          <div class="char-counter" :class="{'warning': remainingChars < 50}">
            {{ remainingChars }} caracteres restantes
          </div>
        </div>
      </div>

      <button type="submit" class="submit-button" :disabled="!reviewData.rating || !reviewData.comment">
        <i class="pi pi-check-circle"></i>
        Publicar reseña
      </button>
    </form>
  </div>
</template>

<style scoped>
.make-review {
  padding: 25px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin: 20px 0;
  transition: transform 0.2s;
}

.make-review:hover {
  transform: translateY(-2px);
}

.review-title {
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 1.5rem;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-title i {
  color: #4CAF50;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #444;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-label {
  font-size: 16px;
  color: #333;
}

.rating-container {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-top: 10px;
}

.rating-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.rating-star {
  font-size: 32px;
  color: #ddd;
  cursor: pointer;
  transition: transform 0.2s, color 0.3s;
  display: inline-block;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.rating-star:hover {
  transform: scale(1.3) rotate(5deg);
}

.star-hover, .star-selected {
  color: #ffc107;
}

.star-selected-and-hover {
  color: #ffdb58;
}

.rating-text {
  display: block;
  margin-top: 5px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.textarea-container {
  position: relative;
  margin-top: 8px;
}

.styled-textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s, box-shadow 0.3s;
  resize: vertical;
  min-height: 120px;
  background-color: #fff;
}

.styled-textarea:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.char-counter {
  position: absolute;
  bottom: 10px;
  right: 12px;
  font-size: 12px;
  color: #888;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 10px;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.char-counter.warning {
  color: #ff5252;
  font-weight: bold;
  background: rgba(255, 82, 82, 0.1);
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.25);
}

.submit-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
}

.submit-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.submit-button i {
  font-size: 18px;
}

@media (max-width: 768px) {
  .make-review {
    padding: 20px;
  }

  .styled-textarea {
    font-size: 16px;
  }

  .rating-star {
    font-size: 28px;
  }
}
</style>