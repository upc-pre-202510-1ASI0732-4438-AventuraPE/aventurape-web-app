import ProfileAvComponent from "@/domains/profileManagement/adventurer/views/profileAv.component.vue";

import ActivityCardList from "@/domains/postManagement/adventurer/views/activity-card-list.component.vue";
import HomeAdventurer from "@/domains/postManagement/adventurer/views/home-adventurer.component.vue";
import ActivityDetail from "@/domains/postManagement/adventurer/views/activity-detail.component.vue";
import FavoritesSection from "@/domains/postManagement/adventurer/views/favorites-section.vue";

export default [
  // Profile Management
  {
    path: '/adventurer',
    name: 'AdventurerDashboard',
    component:  HomeAdventurer ,
    meta: { requiresAuth: true, role: ['ROLE_ADVENTUROUS', 'ROLE_ADMIN'] }
  },
  {
    path: '/adventurer/profile',
    name: 'AdventurerProfile',
    component: ProfileAvComponent,
    meta: { requiresAuth: true, requiredRoles: ['ROLE_ADVENTUROUS', 'ROLE_ADMIN'] }
  },
  {
    path: '/adventurer/posts/:id',
    name: 'activity-detail',
    component: ActivityDetail,
    meta: { requiresAuth: true, requiredRoles: ['ROLE_ADVENTUROUS', 'ROLE_ADMIN'] }
  },
  // Navigation from HeaderNav
  {
    path: '/buscar',
    name: 'AdventurerSearch',
    component: ActivityCardList,
    props: true,
    meta: { requiresAuth: true, requiredRoles: ['ROLE_ADVENTUROUS', 'ROLE_ADMIN'] }
  },
  {
    path: '/favoritos',
    name: 'Favorites',
    component: FavoritesSection,
    props: true,
    meta: { requiresAuth: true, requiredRoles: ['ROLE_ADVENTUROUS'] }
  }
]