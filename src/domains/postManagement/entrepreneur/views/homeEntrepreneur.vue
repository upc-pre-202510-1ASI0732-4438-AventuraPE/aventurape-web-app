<script>
import { ActivityApiService } from '@/domains/postManagement/shared/services/activity-api.service.js';
import { AuthenticationService } from '@/domains/IAM/services/authentication.service.js';
import Cookies from 'js-cookie';

export default {
  name: "homeEntrepreneur",
  data() {
    return {
      publications: [],
      entrepreneurId: null,
      loading: false,
      error: null,
      newPublication: {
        nameActivity: '',
        description: '',
        timeDuration: '',
        image: '',
        cantPeople: '',
        cost: ''
      },
      editingPublication: null,
      showForm: false
    }
  },
  created() {
    this.fetchUserInfo();
  },
  methods: {
    async fetchUserInfo() {
      try {
        this.loading = true;
        // Import AuthenticationService
        const AuthenticationService = (await import('@/domains/IAM/services/authentication.service.js')).AuthenticationService;
        const authService = new AuthenticationService();

        // Get userId from cookies or localStorage
        const userId = localStorage.getItem("userId") || Cookies.get("userId");

        if (!userId) {
          this.error = 'No se encontró información de usuario. Por favor inicie sesión nuevamente.';
          this.loading = false;
          return;
        }

        // Use getUserById from AuthenticationService
        const response = await authService.getUserById(userId);

        if (!response || !response.data || !response.data.id) {
          this.error = 'No se pudo obtener la información del usuario.';
          this.loading = false;
          return;
        }

        this.entrepreneurId = response.data.id;
        console.log("User ID loaded from auth service:", this.entrepreneurId);
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
        const activityService = new ActivityApiService();
        const response = await activityService.getAllActivitiesByEntrepreneurId(this.entrepreneurId);

        console.log("Publications response:", response);

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
    },

    async savePublication() {
      try {
        this.loading = true;
        const activityService = new ActivityApiService();

        if (this.editingPublication) {
          // Update existing publication
          await activityService.updatePublication(
              this.editingPublication.id || this.editingPublication.Id,
              this.newPublication
          );
        } else {
          // Create new publication
          const publication = {
            ...this.newPublication,
            entrepreneurId: this.entrepreneurId
          };
          await activityService.postPublication(publication);
        }

        // Reset form and refresh publications
        this.resetForm();
        this.fetchPublications();
      } catch (err) {
        this.error = `Error al guardar la publicación: ${err.message}`;
        console.error("Error saving publication:", err);
        this.loading = false;
      }
    },

    async deletePublication(id) {
      if (!confirm('¿Estás seguro de que deseas eliminar esta publicación?')) return;

      try {
        this.loading = true;
        const activityService = new ActivityApiService();
        await activityService.deletePublication(id);
        this.fetchPublications();
      } catch (err) {
        this.error = `Error al eliminar la publicación: ${err.message}`;
        console.error("Error deleting publication:", err);
        this.loading = false;
      }
    },

    editPublication(publication) {
      this.showForm = true;
      this.editingPublication = publication;
      this.newPublication = {
        nameActivity: publication.nameActivity,
        description: publication.description,
        timeDuration: publication.timeDuration,
        image: publication.image,
        cantPeople: publication.cantPeople,
        cost: publication.cost
      };
    },

    resetForm() {
      this.newPublication = {
        nameActivity: '',
        description: '',
        timeDuration: '',
        image: '',
        cantPeople: '',
        cost: ''
      };
      this.editingPublication = null;
      this.showForm = false;
      this.error = null;
    }
  }
}
</script>

<template>
  <div class="home-container">
    <h1 class="page-title">Bienvenido Emprendedor</h1>

    <div v-if="loading" class="loading">Cargando...</div>

    <div v-if="error" class="error-message">{{ error }}</div>

    <div class="actions">
      <button @click="showForm = !showForm" class="btn-primary">
        {{ showForm ? 'Cancelar' : 'Nueva Publicación' }}
      </button>
    </div>

    <!-- Publication Form -->
    <div v-if="showForm" class="publication-form">
      <h2>{{ editingPublication ? 'Editar Publicación' : 'Nueva Publicación' }}</h2>
      <form @submit.prevent="savePublication">
        <div class="form-group">
          <label for="title">Título</label>
          <input type="text" id="title" v-model="newPublication.nameActivity" required>
        </div>

        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea id="description" v-model="newPublication.description" required></textarea>
        </div>

        <div class="form-group">
          <label for="duration">Duración (minutos)</label>
          <input type="number" id="duration" v-model="newPublication.timeDuration" required>
        </div>

        <div class="form-group">
          <label for="image">Imagen URL</label>
          <input type="text" id="image" v-model="newPublication.image"
                 placeholder="https://example.com/image.jpg">
          <small class="form-hint">Ingresa la URL de una imagen</small>
        </div>

        <div class="form-group">
          <label for="capacity">Capacidad (personas)</label>
          <input type="number" id="capacity" v-model="newPublication.cantPeople" required>
        </div>

        <div class="form-group">
          <label for="price">Precio</label>
          <input type="number" id="price" v-model="newPublication.cost" required>
        </div>

        <div class="form-actions">
          <button type="button" @click="resetForm" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">{{ editingPublication ? 'Actualizar' : 'Publicar' }}</button>
        </div>
      </form>
    </div>

    <!-- Publications List -->
    <div class="content">
      <h2>Mis Publicaciones</h2>

      <div v-if="publications.length === 0" class="empty-state">
        No tienes publicaciones aún. ¡Crea tu primera actividad!
      </div>

      <div v-else class="publications-list">
        <div v-for="pub in publications" :key="pub.id || pub.Id" class="publication-card">
          <h3>{{ pub.nameActivity }}</h3>
          <div class="image-container">
            <img :src="pub.image" alt="Activity image" class="activity-image">
          </div>
          <p class="description">{{ pub.description }}</p>
          <div class="publication-details">
            <span class="price">Precio: ${{ pub.cost }}</span>
            <span class="duration">Duración: {{ pub.timeDuration }} minutos</span>
            <span class="capacity">Capacidad: {{ pub.cantPeople }} personas</span>
          </div>
          <div class="publication-actions">
            <button @click="editPublication(pub)" class="btn-edit">Editar</button>
            <button @click="deletePublication(pub.id || pub.Id)" class="btn-delete">Eliminar</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-title {
  color: #2980B9;
  margin-bottom: 20px;
  font-size: 24px;
}

.content {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  background-color: #2980B9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.btn-edit {
  background-color: #f39c12;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.loading {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}

.error-message {
  padding: 15px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  color: #721c24;
  margin-bottom: 20px;
}

.publication-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group textarea {
  height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.publications-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.publication-card {
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.publication-card h3 {
  margin-top: 0;
  color: #2c3e50;
}

.description {
  color: #555;
  margin-bottom: 15px;
}

.publication-details {
  margin-bottom: 15px;
  font-size: 14px;
}

.price, .location {
  display: block;
  margin-bottom: 5px;
}

.publication-actions {
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #7f8c8d;
  font-style: italic;
}
.image-container {
  width: 100%;
  height: 150px;
  overflow: hidden;
  margin-bottom: 10px;
  border-radius: 4px;
}

.activity-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-hint {
  color: #666;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}
</style>