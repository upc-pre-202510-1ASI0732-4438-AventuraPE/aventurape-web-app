
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthenticationStore } from '@/domains/IAM/services/authentication.store.js';
import Cookies from 'js-cookie';

const router = useRouter();
const authStore = useAuthenticationStore();
const roles = ref([]);

const fetchRoles = async () => {
  try {
    if (authStore.roles.length) {
      roles.value = authStore.roles;
    } else {
      const userId = Cookies.get('userId');
      if (userId) {
        await authStore.fetchRoles(userId);
        roles.value = authStore.roles || [];
      }
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
    roles.value = [];
  }
};

onMounted(fetchRoles);

//Administrador
const hasAdminRole = computed(() => Array.isArray(roles.value) && roles.value.includes('ROLE_ADMIN'));

const hasAdventurousRole = computed(() => Array.isArray(roles.value) && roles.value.includes('ROLE_ADVENTUROUS'));
const hasEntrepreneurRole = computed(() => Array.isArray(roles.value) && roles.value.includes('ROLE_ENTREPRENEUR'));
const isLoggedIn = computed(() => !!Cookies.get('token'));
const isEntrepreneurRoute = computed(() => router.currentRoute.value.path.includes('entrepreneur'));
const effectiveRole = computed(() => (isEntrepreneurRoute.value ? 'entrepreneur' : 'adventurer'));

const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Update the signOut function in HeaderNav.vue to add more debugging
const signOut = () => {
  if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
    authStore.signOut(router);
  }
};
const getHomeRoute = () => {
  if (hasAdminRole.value) return '/admin-home';
  if (hasEntrepreneurRole.value) return '/entrepreneur-home';
  if (hasAdventurousRole.value) return '/adventurous-home';
  return '/sign-in'; // Fallback
}
</script>


<template>
  <header class="header-nav">
    <nav class="nav-container">

      <div class="mobile-menu-toggle" @click="toggleMobileMenu">
        <font-awesome-icon icon="bars" />
      </div>

      <div class="nav-items" :class="{ 'mobile-open': isMobileMenuOpen }">

        <div class="nav-item home" @click="closeMobileMenu">
          <!--Estoy añadiendo aca tambien al admin-->
          <router-link :to="getHomeRoute()">
            <font-awesome-icon icon="home" />
            <span>Inicio</span>
          </router-link>
        </div>
        <!-- Opciones para el rol Administrador -->
        <template v-if="hasAdminRole ">
          <div class="nav-item search" @click="closeMobileMenu">
            <router-link to="/buscar-admin">
              <font-awesome-icon icon="search" />
              <span>Buscar actividades</span>
            </router-link>
          </div>
        </template>

        <!-- Opciones para el rol Adventurer -->
        <template v-if="hasAdventurousRole ">
          <div class="nav-item search" @click="closeMobileMenu">
            <router-link to="/buscar">
              <font-awesome-icon icon="search" />
              <span>Buscar</span>
            </router-link>
          </div>
          <div class="nav-item favorites" @click="closeMobileMenu">
            <router-link to="/favoritos">
              <font-awesome-icon icon="heart" />
              <span>Favoritos</span>
            </router-link>
          </div>
          <div class="nav-item account" @click="closeMobileMenu">
            <router-link to="/adventurer/profile">
              <font-awesome-icon icon="user" />
              <span>Mi Cuenta</span>
            </router-link>
          </div>
        </template>

        <!-- Opciones para el rol Entrepreneur -->
        <template v-if="hasEntrepreneurRole">
          <div class="nav-item stats" @click="closeMobileMenu">
            <router-link to="/entrepreneur/statistics">
              <font-awesome-icon icon="chart-bar" />
              <span>Estadísticas</span>
            </router-link>
          </div>
          <div class="nav-item subs" @click="closeMobileMenu">
            <router-link to="/entrepreneur/subscriptions">
              <font-awesome-icon icon="dollar-sign" />
              <span>Suscripciones</span>
            </router-link>
          </div>
          <div class="nav-item account" @click="closeMobileMenu">
            <router-link to="/entrepreneur/profile">
              <font-awesome-icon icon="user" />
              <span>Mi cuenta</span>
            </router-link>
          </div>
        </template>

        <!-- Botón de cerrar sesión para todos los usuarios -->
        <div class="nav-item sign-out" @click="closeMobileMenu">
          <a href="#" @click.prevent="signOut">
            <font-awesome-icon icon="sign-out-alt" />
            <span>Cerrar Sesión</span>
          </a>
        </div>

      </div>
    </nav>
  </header>
</template>

<style scoped>
.header-nav {
  background-color: var(--primary-lighter);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.nav-item a {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--primary-light);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-item a:hover {
  color: #765532;
}
.nav-item.sign-out {
  margin-left: auto !important;
}

.sign-out a {
  color: var(--error-color, #e74c3c);
}

.mobile-menu-toggle {
  display: none;
  cursor: pointer;
  font-size: 1.5rem;
}
span{
  margin-left: 5px;
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }

  .nav-items {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background-color: var(--primary-lighter);
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-150%);
    opacity: 0;
    transition: transform 0.3s ease-in-out, opacity 0.3s;
    z-index: 999;
    height: auto;
    visibility: hidden;
  }

  .nav-items.mobile-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-items .nav-item {
    width: 100%;
    text-align: left;
    padding: 10px 0;
  }

  .nav-items .nav-item a {
    font-size: 16px;
    padding: 5px 0;
    display: block;
  }

  .nav-item.sign-out {
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px solid rgba(0,0,0,0.1);
  }
  .sign-out a {
    margin-top: 10px;
  }
}
</style>
