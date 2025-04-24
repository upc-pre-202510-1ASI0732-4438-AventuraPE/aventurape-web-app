<script>
import PublicationCard from '@/domains/statisticsManagement/entrepreneur/components/publication-card.component.vue';
import { EntrepreneurStadisticsApiService } from '@/domains/statisticsManagement/entrepreneur/services/Entrepreneur-Stadistics-api.service.js';
import { AuthenticationService } from '@/domains/IAM/services/authentication.service.js';
import Cookies from 'js-cookie';
import ActivityList from "@/domains/postManagement/entrepreneur/components/activity-list.component.vue";

export default {
  name: "EntrepreneurStatistics",
  components: {
    ActivityList,
    PublicationCard
  },
  data() {
    return {
      publications: [],
      entrepreneurId: null,
      loading: false,
      error: null
    }
  },
  created() {
    this.fetchUserInfo();
  },
  methods: {
    async fetchUserInfo() {
      try {
        this.loading = true;
        const authService = new AuthenticationService();

        // Get userId from cookies or localStorage
        const userId = localStorage.getItem("userId") || Cookies.get("userId");

        if (!userId) {
          this.error = 'No se encontró información de usuario. Por favor inicie sesión nuevamente.';
          this.loading = false;
          return;
        }

        const response = await authService.getUserById(userId);

        if (!response || !response.data || !response.data.id) {
          this.error = 'No se pudo obtener la información del usuario.';
          this.loading = false;
          return;
        }

        this.entrepreneurId = response.data.id;
        this.fetchPublications();
      } catch (err) {
        this.error = `Error al cargar información de usuario: ${err.message}`;
        console.error("Error loading user info:", err);
        this.loading = false;
      }
    },

    async fetchPublications() {
      try {
        if (!this.entrepreneurId) {
          console.error("Cannot fetch publications without entrepreneur ID");
          return;
        }

        this.loading = true;
        const entrepreneurStadisticsApiService = new EntrepreneurStadisticsApiService();
        const response = await entrepreneurStadisticsApiService.getAllActivitiesOrderByRatingByEntrepreneurId(this.entrepreneurId);


        if (response && response.data && Array.isArray(response.data)) {
          this.publications = response.data;
        } else if (response && response.data && !Array.isArray(response.data)) {
          this.publications = [response.data];
        } else if (response && Array.isArray(response)) {
          this.publications = response;
        } else {
          this.publications = [];
        }
      } catch (err) {
        this.error = `Error al cargar publicaciones: ${err.message}`;
        console.error("Error fetching publications:", err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<template>
  <div class="home-container">
    <div class="hero-section">
      <h1 class="page-title">Estadisticas</h1>
      <p class="subtitle">Visualiza tus actividades mejor puntuadas</p>
    </div>

    <div v-if="error" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>

    <PublicationCard
        :publications="publications"
        :loading="loading"
    />

  </div>
</template>

<style scoped>
.home-container {
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background-color: var(--primary-lighter);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.page-title {
  color: var(--primary-color);
  margin-bottom: 10px;
  font-size: 32px;
  font-weight: 700;
}

.subtitle {
  color: var(--text-light);
  font-size: 18px;
}

.actions {
  margin-bottom: 30px;
  display: flex;
  justify-content: flex-end;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s;
}

.action-button:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background-color: var(--primary-light);
  box-shadow: 0 4px 12px rgba(118, 85, 50, 0.3);
}

.error-message {
  padding: 20px;
  background-color: #fff0f0;
  border-left: 4px solid var(--error-color);
  border-radius: 8px;
  color: var(--error-color);
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>