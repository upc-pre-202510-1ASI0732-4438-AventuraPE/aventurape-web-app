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
      isNewProfile: true,
      genderOptions: [
        { value: "MALE", label: "Masculino" },
        { value: "FEMALE", label: "Femenino" },
        { value: "NOBINARY", label: "No Binario" }
      ],
      validationErrors: {
        postalCode: false,
        number: false
      },
      debugInfo: null,
      userName: ""
    }
  },
  async created() {
    await this.fetchUserData();
    await this.fetchAdventurerProfile();
  },
  methods: {
    async fetchUserData() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const profileService = new Profile();
        const response = await profileService.getUserById(userId);

        if (response && response.data) {
          this.userName = response.data.username || "Usuario";
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        this.userName = "Usuario";
      }
    },
    async fetchAdventurerProfile() {
      try {
        this.loading = true;
        const profileService = new Profile();
        const userId = localStorage.getItem("userId");

        const response = await profileService.getAdventurerProfileByUserId(userId);

        if (response && response.data) {
          const data = response.data;
          const [firstName, lastName] = data.fullName ? data.fullName.split(' ') : ['', ''];
          const [street, numberAndCity] = data.streetAddress ? data.streetAddress.split(', ') : ['', ''];
          const [number, city] = numberAndCity ? numberAndCity.split(' ') : ['', ''];

          this.adventurer = new Adventurer(
              data.id,
              data.userId,
              firstName,
              lastName,
              data.gender,
              data.email,
              street,
              number,
              city,
              data.postalCode,
              data.country,
              data.fullName,
              data.streetAddress
          );

          this.isNewProfile = false;
        } else {
          this.isNewProfile = true;
        }
      } catch (err) {
        this.isNewProfile = true;
      } finally {
        this.loading = false;
      }
    },

    validateNumberInput(value) {
      const isValid = /^\d+$/.test(value);
      this.validationErrors.number = !isValid;
      return isValid;
    },

    validatePostalCodeInput(value) {
      const isValid = /^\d{5}$/.test(value);
      this.validationErrors.postalCode = !isValid;
      return isValid;
    },

    validateForm() {
      let isValid = true;

      if (!this.validateNumberInput(this.adventurer.number)) {
        isValid = false;
      }

      if (!this.validatePostalCodeInput(this.adventurer.postalCode)) {
        isValid = false;
      }

      return isValid;
    },

    async createProfile() {
      if (!this.isNewProfile) {
        this.error = "Ya tienes un perfil creado.";
        return;
      }

      if (!this.validateForm()) {
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
        await this.fetchAdventurerProfile();
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
    <div v-if="loading" class="loading-container">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando perfil...
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <i class="fa-solid fa-exclamation"></i>
        </div>
        <span class="error-message">{{ error }}</span>
      </div>
      <button class="close-btn" @click="error = null">
        <i class="fa-solid fa-times"></i>
      </button>
    </div>

    <div v-else-if="isNewProfile" class="form-container">
      <h2 class="form-title">
        <i class="fa-solid fa-user-plus form-icon"></i>
         {{ userName }}! Crea tu perfil
      </h2>
      <form @submit.prevent="createProfile">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">
              <i class="fa-solid fa-user"></i> Nombre
            </label>
            <input id="firstName" v-model="adventurer.firstName" placeholder="Ingresa tu nombre" required />
          </div>

          <div class="form-group">
            <label for="lastName">
              <i class="fa-solid fa-user"></i> Apellido
            </label>
            <input id="lastName" v-model="adventurer.lastName" placeholder="Ingresa tu apellido" required />
          </div>
        </div>

        <div class="form-group">
          <label for="email">
            <i class="fa-solid fa-envelope"></i> Correo Electrónico
          </label>
          <input id="email" v-model="adventurer.email" type="email" placeholder="ejemplo@correo.com" required />
        </div>


        <div class="form-group">
          <label for="gender">
            <i class="fa-solid fa-venus-mars"></i> Género
          </label>
          <select id="gender" v-model="adventurer.gender" required>
            <option disabled value="">Seleccione Género</option>
            <option v-for="option in genderOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="street">
            <i class="fa-solid fa-road"></i> Calle
          </label>
          <input id="street" v-model="adventurer.street" placeholder="Nombre de la calle" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="number">
              <i class="fa-solid fa-hashtag"></i> Número
            </label>
            <input
              id="number"
              v-model="adventurer.number"
              placeholder="123"
              required
              :class="{ 'input-error': validationErrors.number }"
              @input="validateNumberInput($event.target.value)"
            />
            <span v-if="validationErrors.number" class="error-text">
              <i class="fa-solid fa-circle-exclamation"></i> Solo se permiten números
            </span>
          </div>

          <div class="form-group">
            <label for="city">
              <i class="fa-solid fa-city"></i> Ciudad
            </label>
            <input id="city" v-model="adventurer.city" placeholder="Tu ciudad" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="postalCode">
              <i class="fa-solid fa-mailbox"></i> Código Postal
            </label>
            <input
              id="postalCode"
              v-model="adventurer.postalCode"
              placeholder="12345"
              required
              :class="{ 'input-error': validationErrors.postalCode }"
              @input="validatePostalCodeInput($event.target.value)"
            />
            <span v-if="validationErrors.postalCode" class="error-text">
              <i class="fa-solid fa-circle-exclamation"></i> El código postal debe tener 5 dígitos
            </span>
          </div>

          <div class="form-group">
            <label for="country">
              <i class="fa-solid fa-globe"></i> País
            </label>
            <input id="country" v-model="adventurer.country" placeholder="Tu país" required />
          </div>
        </div>

        <button type="submit" class="submit-btn">
          <i class="fa-solid fa-save"></i> Guardar Perfil
        </button>
      </form>
    </div>

    <div v-else class="profile-container">
      <h2 class="profile-title">
        <i class="fa-solid fa-user-check"></i> Perfil de {{ userName }}
      </h2>

      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            {{ adventurer.firstName ? adventurer.firstName.charAt(0) : 'A' }}
          </div>
          <h3>{{ adventurer.fullName }}</h3>
        </div>

        <div class="profile-details">
          <div class="profile-detail-item">
            <div class="detail-icon">
              <i class="fa-solid fa-envelope"></i>
            </div>
            <div class="detail-content">
              <span class="detail-label">Correo Electrónico</span>
              <span class="detail-value">{{ adventurer.email }}</span>
            </div>
          </div>

          <div class="profile-detail-item">
            <div class="detail-icon">
              <i class="fa-solid fa-venus-mars"></i>
            </div>
            <div class="detail-content">
              <span class="detail-label">Género</span>
              <span class="detail-value">{{ adventurer.gender }}</span>
            </div>
          </div>

          <div class="profile-detail-item">
            <div class="detail-icon">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div class="detail-content">
              <span class="detail-label">Dirección</span>
              <span class="detail-value">{{ adventurer.streetAddress }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.adventurer-profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.loading-container {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #765532;
}

.error-container {
  position: relative;
  background-color: #fff8f8;
  border-left: 4px solid #f15c5c;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(241, 92, 92, 0.15);
}

.error-content {
  display: flex;
  align-items: center;
}

.error-message {
  color: #f15c5c;
  font-weight: 500;
}

.error-icon {
  background-color: #f15c5c;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
  font-style: normal;
}

.close-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  color: #999;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #666;
}

.form-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

.form-title {
  color: #765532;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 600;
  font-size: 1.75rem;
  border-bottom: 2px solid #faf6f2;
  padding-bottom: 0.75rem;
}

.form-group {
  margin-bottom: 1.25rem;
  width: 100%;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

input, select {
  padding: 0.75rem 1rem;
  width: 100%;
  border: 2px solid #e1d5c8;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  background-color: #fcfaf7;
}

input:focus, select:focus {
  border-color: #765532;
  outline: none;
  box-shadow: 0 0 0 3px rgba(118, 85, 50, 0.15);
  background-color: #fff;
}

.input-error {
  border-color: #f15c5c;
  background-color: #fff8f8;
}

.input-error:focus {
  border-color: #f15c5c;
  box-shadow: 0 0 0 3px rgba(241, 92, 92, 0.15);
}

.error-text {
  display: block;
  color: #f15c5c;
  font-size: 0.85rem;
  margin-top: 0.4rem;
  font-weight: 500;
}

.submit-btn {
  background-color: #765532;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.9rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(118, 85, 50, 0.3);
}

.submit-btn:hover {
  background-color: #A88662;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(118, 85, 50, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

.profile-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

.profile-title {
  color: #765532;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 600;
  font-size: 1.75rem;
  border-bottom: 2px solid #faf6f2;
  padding-bottom: 0.75rem;
}

.profile-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e1d5c8;
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background-color: #faf6f2;
  border-bottom: 1px solid #e1d5c8;
}

.profile-avatar {
  width: 70px;
  height: 70px;
  background-color: #765532;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  margin-right: 1.25rem;
  box-shadow: 0 3px 8px rgba(118, 85, 50, 0.3);
  text-transform: uppercase;
}

.profile-header h3 {
  font-size: 1.5rem;
  margin: 0;
  color: #765532;
  font-weight: 600;
}

.profile-details {
  padding: 1.5rem;
}

.profile-detail-item {
  display: flex;
  margin-bottom: 1.25rem;
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.profile-detail-item:hover {
  background-color: #faf6f2;
}

.detail-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3ecdf;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.detail-content {
  flex: 1;
}

.detail-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.3rem;
  font-weight: 500;
}

.detail-value {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

/* Icon color adjustment */
.fa-solid {
  color: #A88662;
}

.error-icon .fa-solid,
.error-text .fa-solid {
  color: var(--error-color);
}

.submit-btn .fa-solid,
.profile-title .fa-solid {
  color: var(--white);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .adventurer-profile {
    padding: 1.25rem;
    margin: 1rem;
    max-width: none;
  }

  .form-container, .profile-container {
    padding: 1.5rem;
  }
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-avatar {
    margin-right: 0;
    margin-bottom: 1rem;
  }
}
</style>