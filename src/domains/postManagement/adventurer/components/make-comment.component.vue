<script>
// make-comment.component.vue - script section
export default {
  name: 'MakeComment',
  emits: ['submit-review'],

  data() {
    return {
      reviewData: {
        rating: 0,
        comment: ''
      },
      hoverRating: 0,
      maxLength: 500
    };
  },

  computed: {
    remainingChars() {
      return this.maxLength - this.reviewData.comment.length;
    }
  },

  methods: {
    setRating(value) {
      this.reviewData.rating = value;
    },

    setHoverRating(value) {
      this.hoverRating = value;
    },

    resetHoverRating() {
      this.hoverRating = 0;
    },

    getStarClass(star) {
      if (this.hoverRating >= star) {
        return this.reviewData.rating >= star ? 'star-selected-and-hover' : 'star-hover';
      } else {
        return this.reviewData.rating >= star ? 'star-selected' : '';
      }
    },

    submitReview() {
      const newReview = {
        content: this.reviewData.comment,
        rating: this.reviewData.rating,
        adventureId: 1 // Temporalmente hardcodeado, después lo obtienes del store
      };

      this.$emit('submit-review', newReview);

      // Resetear formulario
      this.reviewData.rating = 0;
      this.reviewData.comment = '';
    }
  }
};
</script>

<template>
  <div class="make-review">
    <div class="review-header">
      <i class="pi pi-comments"></i>
      <h3 class="review-title">Comparte tu experiencia</h3>
    </div>

    <form @submit.prevent="submitReview" class="review-form">
      <div class="form-group rating-group">
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
          >★</span>
        </div>
        <span class="rating-text" :class="{'rating-selected': reviewData.rating > 0}">
          {{ reviewData.rating ? `${reviewData.rating} de 5 estrellas` : 'Selecciona una calificación' }}
        </span>
      </div>

      <div class="form-group">
        <label for="reviewComment">
          <i class="pi pi-pencil"></i>
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

      <button type="submit" class="submit-button" :disabled="!reviewData.rating || !reviewData.comment.trim()">
        <i class="pi pi-send"></i>
        Publicar reseña
      </button>
    </form>
  </div>
</template>

<style scoped>
.make-review {
  padding: 30px;
  background: linear-gradient(145deg, #ffffff, var(--primary-lighter));
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(118, 85, 50, 0.08);
  margin: 30px 0;
  border: 1px solid rgba(118, 85, 50, 0.1);
  transition: all 0.3s ease;
}

.make-review:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(118, 85, 50, 0.12);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  border-bottom: 2px solid rgba(118, 85, 50, 0.2);
  padding-bottom: 15px;
}

.review-header i {
  font-size: 2rem;
  color: var(--primary-color);
  background: rgba(118, 85, 50, 0.1);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.review-title {
  margin: 0;
  font-size: 1.6rem;
  color: var(--primary-color);
  font-weight: 600;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  margin-bottom: 5px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.2s ease;
  border: 1px solid rgba(168, 134, 98, 0.1);
}

.form-group:hover {
  box-shadow: 0 5px 15px rgba(118, 85, 50, 0.08);
}

.rating-group {
  text-align: center;
}

label {
  display: block;
  margin-bottom: 15px;
  font-weight: 600;
  color: var(--text-dark);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
}

.rating-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 12px;
}

.rating-star {
  font-size: 38px;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.rating-star:hover {
  transform: scale(1.2) rotate(10deg);
}

.rating-star::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-color);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.star-hover, .star-selected {
  color: #d4a76a;
}

.star-selected::after {
  width: 8px;
  height: 8px;
}

.star-selected-and-hover {
  color: var(--primary-color);
  transform: scale(1.2);
}

.rating-text {
  display: block;
  margin-top: 10px;
  font-size: 1rem;
  color: var(--text-light);
  font-weight: 500;
  transition: color 0.3s;
}

.rating-selected {
  color: var(--primary-color);
  font-weight: 600;
}

.textarea-container {
  position: relative;
  margin-top: 12px;
}

.styled-textarea {
  width: 100%;
  padding: 18px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  line-height: 1.6;
  transition: all 0.3s;
  resize: vertical;
  min-height: 150px;
  font-family: inherit;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.03);
}

.styled-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(118, 85, 50, 0.15), inset 0 2px 5px rgba(0, 0, 0, 0);
}

.char-counter {
  position: absolute;
  bottom: 12px;
  right: 15px;
  font-size: 0.8rem;
  color: #777;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.char-counter.warning {
  color: var(--error-color);
  font-weight: bold;
  background: rgba(241, 92, 92, 0.1);
  transform: scale(1.05);
}

.submit-button {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  border: none;
  padding: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  box-shadow: 0 6px 15px rgba(118, 85, 50, 0.25);
  align-self: center;
  width: 70%;
  max-width: 300px;
}

.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(118, 85, 50, 0.35);
  background: linear-gradient(135deg, #8a673c, var(--primary-color));
}

.submit-button:active {
  transform: translateY(1px);
  box-shadow: 0 4px 8px rgba(118, 85, 50, 0.2);
}

.submit-button:disabled {
  background: linear-gradient(135deg, #cccccc, #dddddd);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.submit-button i {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .make-review {
    padding: 20px;
  }

  .form-group {
    padding: 15px;
  }

  .rating-star {
    font-size: 32px;
  }

  .submit-button {
    width: 100%;
  }
}
</style>