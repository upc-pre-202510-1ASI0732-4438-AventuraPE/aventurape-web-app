// src/domains/postManagement/adventurer/components/activity-card.component.vue
<script>
export default {
  name: "ActivityCard",
  props: {
    id: Number,
    title: String,
    image: String,
    people: Number,
    description: String,
    price: Number,
    timeDuration: Number
  },
  methods: {
    goToDetail() {
      this.$router.push({
        name: 'activity-detail',
        params: { id: this.id }
      });
    }
  }
};
</script>

<template>
  <Card class="activity-card" @click="goToDetail">
    <template #header>
      <img :src="image" :alt="title" />
    </template>
    <template #title>{{ title }}</template>
    <template #subtitle>
      <div class="card-meta">
        <span class="meta-item">
          <i class="pi pi-users"></i> {{ people }} personas
        </span>
        <span class="meta-item">
          <i class="pi pi-tag"></i> {{ price.toFixed(2) }} €
        </span>
      </div>
    </template>
    <template #content>
      <p class="card-description">{{ description }}</p>
    </template>
  </Card>
</template>

<style scoped>
.activity-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card-meta {
  display: flex;
  justify-content: space-between;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.meta-item i {
  margin-right: 4px;
}

.card-description {
  color: #666;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>