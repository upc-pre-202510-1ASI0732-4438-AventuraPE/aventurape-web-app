import ActivityDetailAdminComponent from "@/domains/ADMIN/views/activity-detail-admin.component.vue";
import ActivityCardListAdminComponent from "@/domains/ADMIN/views/activity-card-list-admin.component.vue";

export default [
    // Profile Management
    {
        path: '/admin/posts/:id',
        name: 'activity-detail-admin',
        component: ActivityDetailAdminComponent,
        meta: { requiresAuth: true, requiredRoles: ['ROLE_ADMIN'] }
    },
    // Navigation from HeaderNav
    {
        path: '/buscar-admin',
        name: 'AdminSearch',
        component: ActivityCardListAdminComponent,
        props: true,
        meta: { requiresAuth: true, requiredRoles: ['ROLE_ADMIN'] }
    }
]