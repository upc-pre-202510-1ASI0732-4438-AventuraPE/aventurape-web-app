<script>
import { Adventurer } from "@/domains/profileManagement/shared/models/Adventurer.entity.js";
import { Profile } from "@/domains/profileManagement/shared/services/profile-api.service.js";

export default {
  name: "profileAv.component",
  data() {
    return {
      adventurer: new Adventurer(),
      loading: false,
      error: null,
      isNewProfile: true, // Para saber si debe crear o solo mostrar
      genderOptions: ["MALE", "FEMALE", "NOBINARY"],
      debugInfo: null
    }
  },
  async created() {
    await this.fetchAdventurerProfile();
  },
  methods: {
    async fetchAdventurerProfile() {
      try {
        this.loading = true;
        const profileService = new Profile();
        const userId = localStorage.getItem("userId");

        const response = await profileService.getAdventurerProfileByUserId(userId);

        if (response && response.data) {
          const data = response.data;

          // Extraer firstName y lastName de fullName si es necesario
          const [firstName, lastName] = data.fullName ? data.fullName.split(' ') : ['', ''];

          // Extraer componentes de la dirección si es necesario
          const [street, numberAndCity] = data.streetAddress ? data.streetAddress.split(', ') : ['', ''];
          const [number, city] = numberAndCity ? numberAndCity.split(' ') : ['', ''];

          this.adventurer = new Adventurer(
              data.id,
              data.userId,
              firstName, // ahora viene de split
              lastName,  // ahora viene de split
              data.gender,
              data.email,
              street,    // ahora viene de split
              number,    // ahora viene de split
              city,      // ahora viene de split
              data.postalCode,
              data.country,
              data.fullName, // usar directamente lo que viene del backend
              data.streetAddress // usar directamente lo que viene del backend
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
          firstName: this.adventurer.firstName,
          lastName: this.adventurer.lastName,
          email: this.adventurer.email,
          street: this.adventurer.street,
          number: this.adventurer.number,
          city: this.adventurer.city,
          postalCode: this.adventurer.postalCode,
          country: this.adventurer.country,
          gender: this.adventurer.gender
        };

        await profileService.createAdventurerProfile(profileData);
        await this.fetchAdventurerProfile(); // actualizar vista con datos reales
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
  <div class="adventurer-profile">
    <div v-if="loading">Cargando perfil...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="isNewProfile">
      <h2>Crear perfil de Aventurero</h2>
      <form @submit.prevent="createProfile">
        <input v-model="adventurer.firstName" placeholder="Nombre" required />
        <input v-model="adventurer.lastName" placeholder="Apellido" required />
        <input v-model="adventurer.email" placeholder="Correo" type="email" required />
        <select v-model="adventurer.gender" required>
          <option disabled value="">Seleccione Género</option>
          <option v-for="g in genderOptions" :key="g" :value="g">{{ g }}</option>
        </select>
        <input v-model="adventurer.street" placeholder="Calle" required />
        <input v-model="adventurer.number" placeholder="Número" required />
        <input v-model="adventurer.city" placeholder="Ciudad" required />
        <input v-model="adventurer.postalCode" placeholder="Código Postal" required />
        <input v-model="adventurer.country" placeholder="País" required />
        <button type="submit">Guardar Perfil</button>
      </form>
    </div>

    <div v-else class="profile-container">
      <h2>Perfil Aventurero</h2>
      <div class="profile-details">
        <p><strong>Nombre:</strong> {{ adventurer.fullName }}</p>
        <p><strong>Correo:</strong> {{ adventurer.email }}</p>
        <p><strong>Género:</strong> {{ adventurer.gender }}</p>
        <p><strong>Dirección:</strong> {{ adventurer.streetAddress }}</p>
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
