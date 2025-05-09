import HomeAdventurer from "@/domains/postManagement/adventurer/views/home-adventurer.component.vue";
import ProfileAvComponent from "@/domains/profileManagement/adventurer/views/profileAv.component.vue";
import ActivityDetail from "@/domains/postManagement/adventurer/views/activity-detail.component.vue";
import ActivityCardList from "@/domains/postManagement/adventurer/views/activity-card-list.component.vue";
import FavoritesSection from "@/domains/postManagement/adventurer/views/favorites-section.vue";
import ActivityDetailAdminComponent from "@/domains/ADMIN/views/activity-detail-admin.component.vue";

export default [
    // Profile Management
    {
        path: '/admin/posts/:id',
        name: 'activity-detail',
        component: ActivityDetailAdminComponent,
        meta: { requiresAuth: true, requiredRoles: ['ROLE_ADMIN'] }
    },
    // Navigation from HeaderNav
    {
        path: '/buscar',
        name: 'AdventurerSearch',
        component: ActivityCardList,
        props: true,
        meta: { requiresAuth: true, requiredRoles: ['ROLE_ADMIN'] }
    }
]