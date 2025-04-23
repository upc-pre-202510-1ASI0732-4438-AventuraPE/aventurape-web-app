<script>
import {Entrepreneur} from "@/domains/profileManagement/shared/models/Entrepreneur.entity.js";
import {Profile} from "@/domains/profileManagement/shared/services/profile-api.service.js";
import {AuthenticationService} from "@/domains/IAM/services/authentication.service.js";

export default {
  name: "EntrepreneurProfile",
  data() {
    return {
      entrepreneur: new Entrepreneur(),
      username: '',
      loading: false,
      error: null,
      debugInfo: null
    }
  },
  created() {
    this.fetchEntrepreneurProfile();
    this.getUsername();
  },
  methods: {

    async fetchEntrepreneurProfile() {
      try {
        this.loading = true;
        const profileService = new Profile();
        const response = await profileService.getProfileEntrepreneur();

        console.log("API Response:", response);
        this.debugInfo = response;

        if (response && response.data && response.data.length > 0) {
          const data = response.data[0];
          this.entrepreneur = new Entrepreneur(
              data.id,
              data.userId,
              data.name || '',
              data.city || '',
              data.country || '',
              data.number || '',
              data.postalCode || '',
              data.streetAddress || '',
              data.emailAddress || ''
          );

          if (data.username) {
            this.username = data.username;
          } else if (data.emailAddress) {
            this.username = data.emailAddress.split('@')[0];
          }
        } else {
          this.error = 'No data received from API';
        }
      } catch (err) {
        this.error = `Failed to load entrepreneur profile: ${err.message}`;
        console.error("API Error:", err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<template>
  <div class="entrepreneur-profile">
    <div v-if="loading">Loading profile...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!entrepreneur.id" class="error">No profile data found. Please create a profile first.</div>
    <div v-else class="profile-container">
      <h2>Perfil emprendedor</h2>
      <div class="profile-details">
        <p><strong>Nombre del local:</strong> {{ entrepreneur.name }}</p>
        <p><strong>Correo:</strong> {{ entrepreneur.emailAddress }}</p>
        <p><strong>Dirección:</strong> {{ entrepreneur.streetAddress }}</p>
        <p><strong>Ciudad:</strong> {{ entrepreneur.city }}</p>
        <p><strong>País:</strong> {{ entrepreneur.country }}</p>
        <p><strong>Código postal:</strong> {{ entrepreneur.postalCode }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.entrepreneur-profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-details {
  margin-top: 20px;
}

h2 {
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

h3 {
  margin-top: 20px;
  color: #555;
}

.error {
  color: #e74c3c;
  padding: 10px;
  background-color: #fadbd8;
  border-radius: 4px;
}

.debug-info {
  margin-top: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  overflow: auto;
}

.debug-info pre {
  white-space: pre-wrap;
}
</style>