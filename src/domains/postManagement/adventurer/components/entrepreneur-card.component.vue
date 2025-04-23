<script>
import Button from 'primevue/button';

export default {
  name: "EntrepreneurCard",
  components: {
    Button
  },
  props: {
    name: String,
    avatar: String,
    description: {
      type: String,
      default: "Emprendedor especializado en aventuras al aire libre"
    },
    rating: {
      type: Number,
      default: 4.5
    },
    activities: {
      type: Number,
      default: 5
    }
  }
};
</script>

<template>
  <div class="entrepreneur-card">
    <div class="entrepreneur-header">
      <div class="avatar-container">
        <img :src="avatar" :alt="name" class="avatar-image"/>
      </div>
      <div class="entrepreneur-info">
        <h3 class="entrepreneur-name">{{ name }}</h3>
      </div>
    </div>

  </div>
</template>

<style scoped>
.entrepreneur-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.entrepreneur-header {
  padding: 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-container {
  margin-right: 15px;
}

.avatar-image {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3a7539;
}

.entrepreneur-info {
  flex: 1;
}

.entrepreneur-name {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #333;
}

.rating-container {
  display: flex;
  align-items: center;
}

.star {
  color: #ddd;
  font-size: 16px;
}

.star.filled {
  color: #ffc107;
}

.rating-number {
  font-size: 14px;
  margin-left: 5px;
  color: #666;
  font-weight: 600;
}

.entrepreneur-body {
  padding: 20px;
}

.entrepreneur-description {
  color: #555;
  margin-bottom: 20px;
  line-height: 1.5;
  font-size: 14px;
}

.entrepreneur-stats {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 14px;
}

.stat i {
  color: #3a7539;
  font-size: 16px;
}

.profile-button {
  width: 100%;
  background-color: #3a7539 !important;
  border-color: #3a7539 !important;
}

.profile-button:hover {
  background-color: #2a4a29 !important;
  border-color: #2a4a29 !important;
}
</style>