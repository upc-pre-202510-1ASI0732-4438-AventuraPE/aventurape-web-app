<script>
  import { Entrepreneur } from "@/domains/profileManagement/shared/models/Entrepreneur.entity.js";
  import { Profile } from "@/domains/profileManagement/shared/services/profile-api.service.js";
  import '@fortawesome/vue-fontawesome';


  export default {
    name: "EntrepreneurProfile",
    data() {
      return {
        entrepreneur: new Entrepreneur(),
        loading: false,
        error: null,
        isNewProfile: true,
        validationErrors: {
          number: false,
          postalCode: false
        },
        debugInfo: null,
        userName: ""
      }
    },
    async created() {
      await this.fetchEntrepreneurProfile();
      await this.fetchUserData(); // This line is now correct
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
          this.userName = "Usuario"; // Fallback name
        }
      },
      async fetchEntrepreneurProfile() {
        try {
          this.loading = true;
          const profileService = new Profile();
          const userId = localStorage.getItem("userId");

          const response = await profileService.getEntrepreneurProfileByUserId(userId);

          if (response && response.data) {
            const data = response.data;

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
          this.isNewProfile = true;
        } finally {
          this.loading = false;
        }
      },
      validateForm() {
        let isValid = true;

        if (!/^\d{9}$/.test(this.entrepreneur.number)) {
          this.validationErrors.number = true;
          isValid = false;
        } else {
          this.validationErrors.number = false;
        }

        if (!/^\d{5}$/.test(this.entrepreneur.postalCode)) {
          this.validationErrors.postalCode = true;
          isValid = false;
        } else {
          this.validationErrors.postalCode = false;
        }

        return isValid;
      },
      async createProfile() {
        if (!this.isNewProfile) {
          this.error = "Ya tienes un perfil creado.";
          return;
        }

        if (!this.validateForm()) {
          this.error = "Por favor corrige los errores de validación antes de continuar.";
          return;
        }

        if (!this.checkAuthToken()) {
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

          if (!this.entrepreneur.emailAddress) {
            this.error = "Por favor ingresa tu correo electrónico.";
            this.loading = false;
            return;
          }

          await profileService.createEntrepreneurProfile(profileData);
          await this.fetchEntrepreneurProfile(); // actualizar vista con datos reales
        } catch (err) {
          if (err.response && err.response.status === 401) {
            this.error = "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
          } else {
            this.error = `Error al crear perfil: ${err.message}`;
          }
        } finally {
          this.loading = false;
        }
      },
      validateNumberInput(event) {
        const cursorPosition = event.target.selectionStart;

        const previousValue = this.entrepreneur.number;

        this.entrepreneur.number = this.entrepreneur.number.replace(/\D/g, '');

        if (previousValue !== this.entrepreneur.number) {
          this.$nextTick(() => {
            const newPosition = Math.max(0, cursorPosition - (previousValue.length - this.entrepreneur.number.length));
            event.target.setSelectionRange(newPosition, newPosition);
          });
        }

        this.validationErrors.number = this.entrepreneur.number.length !== 0 && this.entrepreneur.number.length !== 9;
      },

      validatePostalCodeInput(event) {
        const cursorPosition = event.target.selectionStart;
        const previousValue = this.entrepreneur.postalCode;
        this.entrepreneur.postalCode = this.entrepreneur.postalCode.replace(/\D/g, '');
        if (previousValue !== this.entrepreneur.postalCode) {
          this.$nextTick(() => {
            const newPosition = Math.max(0, cursorPosition - (previousValue.length - this.entrepreneur.postalCode.length));
            event.target.setSelectionRange(newPosition, newPosition);
          });
        }

        this.validationErrors.postalCode = this.entrepreneur.postalCode.length !== 0 && this.entrepreneur.postalCode.length !== 5;
      },
      checkAuthToken() {
        const token = localStorage.getItem("userId");
        const profileToken = localStorage.getItem("token");

        if (!token) {
          this.error = "No se encontró tu información de usuario. Por favor inicia sesión nuevamente.";
          return false;
        }

        return true;
      },

      isTokenExpired(token) {
        if (!token) return true;

        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.exp * 1000 < Date.now();
        } catch (e) {
          return true;
        }
      }
    },

  }
  </script>
<template>
  <div class="entrepreneur-profile">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando perfil...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <i class="fa-solid fa-circle-exclamation error-icon"></i>
      <p>{{ error }}</p>
      <button @click="error = null" class="close-btn">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div v-else-if="isNewProfile" class="form-container">
      <h2 class="profile-title">
        <i class="fa-solid fa-user-tie"></i> Perfil de {{ userName }}
      </h2>
      <form @submit.prevent="createProfile">
        <div class="form-group">
          <label for="nameEntrepreneurship">
            <i class="fa-solid fa-store"></i> Nombre del emprendimiento
          </label>
          <input
              id="nameEntrepreneurship"
              v-model="entrepreneur.nameEntrepreneurship"
              placeholder="Ingresa el nombre de tu emprendimiento"
              required
          />
          <div class="form-group">
            <label for="emailAddress">
              <i class="fa-solid fa-envelope"></i> Correo Electrónico
            </label>
            <input
                id="emailAddress"
                v-model="entrepreneur.emailAddress"
                type="email"
                placeholder="ejemplo@correo.com"
                required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="street">
              <i class="fa-solid fa-road"></i> Calle
            </label>
            <input
                id="street"
                v-model="entrepreneur.street"
                placeholder="Nombre de la calle"
                required
            />
          </div>

          <div class="form-group">
            <label for="number">
              <i class="fa-solid fa-hashtag"></i> Número (9 dígitos)
            </label>
            <input
                id="number"
                v-model="entrepreneur.number"
                placeholder="123456789"
                maxlength="9"
                @input="validateNumberInput($event)"
                required
                :class="{ 'input-error': validationErrors.number }"
                type="tel"
            />
            <span class="error-text" v-if="validationErrors.number">
              <i class="fa-solid fa-circle-exclamation"></i> El número debe contener exactamente 9 dígitos
            </span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="city">
              <i class="fa-solid fa-city"></i> Ciudad
            </label>
            <input
                id="city"
                v-model="entrepreneur.city"
                placeholder="Ciudad"
                required
            />
          </div>

          <div class="form-group">
            <label for="postalCode">
              <i class="fa-solid fa-mailbox"></i> Código Postal (5 dígitos)
            </label>
            <input
                id="postalCode"
                v-model="entrepreneur.postalCode"
                placeholder="12345"
                maxlength="5"
                @input="validatePostalCodeInput($event)"
                required
                :class="{ 'input-error': validationErrors.postalCode }"
                type="tel"
            />
            <span class="error-text" v-if="validationErrors.postalCode">
              <i class="fa-solid fa-circle-exclamation"></i> El código postal debe contener exactamente 5 dígitos
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="country">
            <i class="fa-solid fa-globe"></i> País
          </label>
          <input
              id="country"
              v-model="entrepreneur.country"
              placeholder="País"
              required
          />
        </div>


        <button type="submit" class="submit-btn">
          <i class="fa-solid fa-floppy-disk"></i> Guardar Perfil
        </button>
      </form>
    </div>

    <div v-else class="profile-container">
      <h2 class="profile-title">
        <i class="fa-solid fa-user-tie"></i> Perfil de {{userName}}
      </h2>
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            {{ entrepreneur.nameEntrepreneurship.charAt(0) }}
          </div>
          <h3>{{ entrepreneur.nameEntrepreneurship }}</h3>
        </div>

        <div class="profile-details">
          <div class="profile-detail-item">
            <div class="detail-icon">
              <i class="fa-solid fa-envelope"></i>
            </div>
            <div class="detail-content">
              <span class="detail-label">Correo electrónico</span>
              <span class="detail-value">{{ entrepreneur.emailAddress }}</span>
            </div>
          </div>

          <div class="profile-detail-item">
            <div class="detail-icon">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div class="detail-content">
              <span class="detail-label">Dirección</span>
              <span class="detail-value">{{ entrepreneur.streetAddress || `${entrepreneur.street}, ${entrepreneur.number} ${entrepreneur.city}` }}</span>
            </div>
          </div>

          <div class="profile-detail-item">
            <div class="detail-icon">
              <i class="fa-solid fa-building"></i>
            </div>
            <div class="detail-content">
              <span class="detail-label">País / Código Postal</span>
              <span class="detail-value">{{ entrepreneur.country }} - {{ entrepreneur.postalCode }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url('@/assets/main.css');

.entrepreneur-profile {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  color: #333;
  background-color: #faf6f2;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(118, 85, 50, 0.2);
  border-radius: 50%;
  border-top-color: #765532;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.fa-solid {
  color: var(--primary-light);
}

.error-icon .fa-solid,
.error-text .fa-solid {
  color: var(--error-color);
}

.submit-btn .fa-solid,
.profile-title .fa-solid {
  color: var(--white);
}
.error-container {
  background-color: #fee;
  border-left: 4px solid #f15c5c;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(241, 92, 92, 0.1);
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .entrepreneur-profile {
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