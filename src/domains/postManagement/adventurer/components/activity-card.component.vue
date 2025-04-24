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
          <i class="pi pi-tag"></i>S/. {{ price.toFixed(2) }}
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
  height: 100%;
  display: flex;
  flex-direction: column;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* Control de tamaño para imágenes en el encabezado */
:deep(.p-card-header) {
  height: 200px;
  overflow: hidden;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

:deep(.p-card-header img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

/* Mejora del padding en todas las secciones de la tarjeta */
:deep(.p-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px !important;
}

:deep(.p-card-title) {
  padding: 0 5px;
  margin-bottom: 10px !important;
}

:deep(.p-card-subtitle) {
  padding: 0 5px;
}

:deep(.p-card-content) {
  flex: 1;
  padding: 10px 5px !important;
  margin-bottom: 0 !important;
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
  padding: 0 5px;
}
</style>