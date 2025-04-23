import { createRouter, createWebHistory } from 'vue-router';
import { AuthenticationService } from '@/domains/IAM/services/authentication.service.js';
import Cookies from 'js-cookie';
import HomeAdventurer from '@/domains/postManagement/adventurer/views/home-adventurer.component.vue';
import ActivityDetail from "@/domains/postManagement/adventurer/views/activity-detail.component.vue";
import ActivityCardList from "@/domains/postManagement/adventurer/views/activity-card-list.component.vue";
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeAdventurer,
    meta: { requiresAuth: true }
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    component: () => import('@/domains/IAM/pages/sign-in.component.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: () => import('@/domains/IAM/pages/sign-up.component.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { requiresAuth: true }
  },
  {
    path: '/adventurous-home',
    name: 'adventurous-home',
    component: HomeAdventurer,
    meta: { requiresAuth: true, requiredRoles: ['ROLE_ADVENTUROUS'] }
  },
  {
    path: '/entrepreneur-home',
    name: 'entrepreneur-home',
    component: () => import('@/domains/postManagement/entrepreneur/views/homeEntrepreneur.vue'),
    meta: { requiresAuth: true, requiredRoles: ['ROLE_ENTREPRENEUR'] }
  },
  {
    path: '/adventurer/posts/:id',
    //    path: '/activities/:id',
    name: 'activity-detail',
    component: ActivityDetail,
    meta: { requiresAuth: true, role: 'adventurer' }
  },
  // Navigation from HeaderNav
  {
    path: '/buscar',
    name: 'AdventurerSearch',
    component: ActivityCardList,
    props: true,
    meta: { requiresAuth: true, role: 'adventurer' }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const isSignedIn = !!Cookies.get('token');
  const userId = Cookies.get('userId');

  // Handle public routes
  if (!to.meta.requiresAuth) {
    return next();
  }

  // Handle protected routes
  if (!isSignedIn) {
    return next({ name: 'sign-in' });
  }

  if (to.name === 'home' || to.name === 'dashboard') {
    try {
      const authService = new AuthenticationService();
      const response = await authService.getUserRoles(userId);
      const roles = response.data.roles || [];

      if (roles.includes('ROLE_ENTREPRENEUR')) {
        return next({ name: 'entrepreneur-home' });
      } else if (roles.includes('ROLE_ADVENTUROUS')) {
        return next({ name: 'adventurous-home' });
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
    return next({ name: 'sign-in' });
  }

  // Check role-based access for other routes
  if (to.meta.requiredRoles) {
    try {
      const authService = new AuthenticationService();
      const response = await authService.getUserRoles(userId);
      const roles = response.data.roles || [];

      const hasAccess = to.meta.requiredRoles.some((role) => roles.includes(role));
      if (!hasAccess) {
        return next({ name: 'sign-in' });
      }
    } catch (error) {
      console.error('Error checking roles:', error);
      return next({ name: 'sign-in' });
    }
  }

  next();
});

export default router;