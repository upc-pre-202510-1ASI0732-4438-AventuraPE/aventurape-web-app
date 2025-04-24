<script>
import { Entrepreneur } from "@/domains/profileManagement/shared/models/Entrepreneur.entity.js";
import { Profile } from "@/domains/profileManagement/shared/services/profile-api.service.js";

export default {
  name: "EntrepreneurProfile",
  data() {
    return {
      entrepreneur: new Entrepreneur(),
      loading: false,
      error: null,
      isNewProfile: true,
      debugInfo: null
    }
  },
  async created() {
    await this.fetchEntrepreneurProfile();
  },
  methods: {
    async fetchEntrepreneurProfile() {
      try {
        this.loading = true;
        const profileService = new Profile();
        const userId = localStorage.getItem("userId");

        const response = await profileService.getEntrepreneurProfileByUserId(userId);

        if (response && response.data) {
          const data = response.data;

          // Extraer componentes de la dirección si es necesario
          const [street, numberAndCity] = data.streetAddress ? data.streetAddress.split(', ') : ['', ''];
          const [number, city] = numberAndCity ? numberAndCity.split(' ') : ['', ''];

          this.entrepreneur = new Entrepreneur(
              data.id,
              data.userId,
              data.name,
              city || data.city,
              data.country,
              number || data.number,
              data.postalCode,
              street || data.street,
              data.streetAddress,
              data.emailAddress
          );

          this.isNewProfile = false;
        } else {
          this.isNewProfile = true;
        }
      } catch (err) {
        // Si ocurre un error por no encontrar el perfil (404), asumimos que es nuevo
        this.isNewProfile = true;
      } finally {
        this.loading = false;
      }
    },
    async createProfile() {
      if (!this.isNewProfile) {
        this.error = "Ya tienes un perfil creado.";
        return;
      }

      try {
        this.loading = true;
        const profileService = new Profile();

        const profileData = {
          nameEntrepreneurship: this.entrepreneur.nameEntrepreneurship,
          addressCity: this.entrepreneur.city,
          addressCountry: this.entrepreneur.country,
          addressNumber: this.entrepreneur.number,
          addressPostalCode: this.entrepreneur.postalCode,
          addressStreet: this.entrepreneur.street,
          emailAddress: this.entrepreneur.emailAddress
        };

        await profileService.createEntrepreneurProfile(profileData);
        await this.fetchEntrepreneurProfile(); // actualizar vista con datos reales
      } catch (err) {
        this.error = `Error al crear perfil: ${err.message}`;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<template>
  <div class="entrepreneur-profile">
    <div v-if="loading">Cargando perfil...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="isNewProfile">
      <h2>Crear perfil de Emprendedor</h2>
      <form @submit.prevent="createProfile">
        <input v-model="entrepreneur.nameEntrepreneurship" placeholder="Nombre del emprendimiento" required />
        <input v-model="entrepreneur.emailAddress" placeholder="Correo electrónico" type="email" required />
        <input v-model="entrepreneur.street" placeholder="Calle" required />
        <input v-model="entrepreneur.number" placeholder="Número" required />
        <input v-model="entrepreneur.city" placeholder="Ciudad" required />
        <input v-model="entrepreneur.postalCode" placeholder="Código Postal" required />
        <input v-model="entrepreneur.country" placeholder="País" required />
        <button type="submit">Guardar Perfil</button>
      </form>
    </div>

    <div v-else class="profile-container">
      <h2>Perfil Emprendedor</h2>
      <div class="profile-details">
        <p><strong>Emprendimiento:</strong> {{ entrepreneur.nameEntrepreneurship }}</p>
        <p><strong>Correo:</strong> {{ entrepreneur.emailAddress }}</p>
        <p><strong>Dirección:</strong> {{ entrepreneur.streetAddress }}</p>
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

form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

input, select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}

.profile-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error {
  color: #e74c3c;
  background-color: #fdd;
  padding: 10px;
  border-radius: 4px;
}
</style>