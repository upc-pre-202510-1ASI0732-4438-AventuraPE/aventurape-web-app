<script>
import {Adventurer} from "@/domains/profileManagement/shared/models/Adventurer.entity.js";
import {Profile} from "@/domains/profileManagement/shared/services/profile-api.service.js";

export default {
  name: "profileAv.component",
  data() {
    return {
      adventurer: new Adventurer(),
      loading: false,
      error: null,
      debugInfo: null
    }
  },
  created() {
    this.fetchAdventurerProfile();
  },
  methods: {
    async fetchAdventurerProfile() {
      try {
        this.loading = true;
        const profileService = new Profile();
        const response = await profileService.getProfileAdventurer();

        console.log("API Response:", response);
        this.debugInfo = response;

        if (response && response.data && response.data.length > 0) {
          const data = response.data[0];
          this.adventurer = new Adventurer(
              data.id,
              data.userId,
              data.firstName || '',
              data.lastName || '',
              data.gender || '',
              data.email || '',
              data.street || '',
              data.number || '',
              data.city || '',
              data.postalCode || '',
              data.country || '',
              data.fullName || '',
              data.streetAddress || ''
          );
        } else {
          this.error = 'No data received from API';
        }
      } catch (err) {
        this.error = `Failed to load adventurer profile: ${err.message}`;
        console.error("API Error:", err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<template>
  <div class="adventurer-profile">
    <div v-if="loading">Loading profile...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!adventurer.id" class="error">No profile data found. Please create a profile first.</div>
    <div v-else class="profile-container">
      <h2>Perfil aventurero</h2>
      <div class="profile-details">
        <p><strong>Nombre:</strong> {{ adventurer.fullName }}</p>
        <p><strong>Correo:</strong> {{ adventurer.email }}</p>
        <p><strong>Género:</strong> {{ adventurer.gender }}</p>
        <p><strong>Ciudad:</strong> {{ adventurer.streetAddress }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.adventurer-profile {
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
</style>