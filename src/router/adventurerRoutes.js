import SearchComponent from "@/domains/postManagement/adventurer/views/search.component.vue";
import ProfileAvComponent from "@/domains/profileManagement/adventurer/views/profileAv.component.vue";
import FavoritesComponent from "@/domains/postManagement/adventurer/views/favorites.component.vue";

export default [
  // Profile Management
  {
    path: '/adventurer/profile',
    name: 'AdventurerProfile',
    component: ProfileAvComponent,
    meta: { requiresAuth: true, requiredRoles: ['ROLE_ADVENTUROUS'] }
  },
  // Navigation from HeaderNav
  {
    path: '/buscar',
    name: 'AdventurerSearch',
    component: SearchComponent,
    meta: { requiresAuth: true, role: 'adventurer' }
  },
  {
    path: '/favoritos',
    name: 'AdventurerFavorites',
    component: FavoritesComponent,
    meta: { requiresAuth: true, role: 'adventurer' }
  }
]