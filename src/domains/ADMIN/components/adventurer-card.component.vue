<template>
  <div class="entrepreneur-card">
    <div class="entrepreneur-header">
      <div class="avatar-container">
        <img v-if="avatar" :src="avatar" :alt="name" class="avatar-image"/>
        <div v-else class="avatar-image avatar-initials" :style="{ backgroundColor: getRandomColor(name) }">
          {{ getInitials(name) }}
        </div>
      </div>
      <div class="entrepreneur-info">
        <h3 class="entrepreneur-name">{{ name }}</h3>
        <div class="entrepreneur-status">
          <span class="status-badge">Aventurero</span>
          <i class="pi pi-check-circle"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Button from 'primevue/button';

export default {
  name: "AdventurerCard",
  components: {
    Button
  },
  props: {
    name: String,
    avatar: String,
    description: {
      type: String,
      default: "aventurero especializado en aventuras al aire libre"
    },
    rating: {
      type: Number,
      default: 4.5
    },
    activities: {
      type: Number,
      default: 5
    }
  },
  methods: {
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
<style scoped>
.entrepreneur-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.4s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.entrepreneur-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(58, 117, 57, 0.18);
}

.entrepreneur-header {
  padding: 24px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
}

.avatar-container {
  margin-right: 20px;
  position: relative;
}

.avatar-image {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 3px solid #3a7539;
}

.avatar-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;
}

.entrepreneur-info {
  flex: 1;
}

.entrepreneur-name {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #333;
  font-weight: 600;
  line-height: 1.2;
}

.entrepreneur-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.status-badge {
  background-color: rgba(58, 117, 57, 0.1);
  color: #3a7539;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.entrepreneur-status i {
  color: #3a7539;
  font-size: 14px;
}

.contact-button {
  background: linear-gradient(135deg, #3a7539, #4d904c);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(58, 117, 57, 0.4);
  margin-top: 5px;
}

.contact-button:hover {
  background: linear-gradient(135deg, #3a7539, #2e5c2d);
  box-shadow: 0 4px 8px rgba(58, 117, 57, 0.6);
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .entrepreneur-header {
    padding: 18px;
    flex-direction: column;
    text-align: center;
  }

  .avatar-container {
    margin-right: 0;
    margin-bottom: 15px;
  }

  .entrepreneur-status {
    justify-content: center;
  }

  .contact-button {
    margin: 0 auto;
  }
}
</style>