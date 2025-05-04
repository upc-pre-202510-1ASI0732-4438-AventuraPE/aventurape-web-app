import StatisticsComponent from "@/domains/statisticsManagement/entrepreneur/views/statistics.component.vue";
import SubscriptionComponent from "@/domains/subscriptionManagement/entrepreneur/views/subscription.component.vue";
import ProfileEmpComponent from "@/domains/profileManagement/entrepreneur/views/profileEmp.component.vue";

export default [
    // Profile Management
    {
        path: '/entrepreneur/profile',
        name: 'EntrepreneurProfile',
        component: ProfileEmpComponent,
        meta: { requiresAuth: true, requiredRoles: ['ROLE_ENTREPRENEUR', 'ROLE_ADMIN']}
    },

    // Statistics Management
    {
        path: '/entrepreneur/statistics',
        name: 'EntrepreneurStatistics',
        component:StatisticsComponent,
        meta: { requiresAuth: true, role: 'entrepreneur' && ['ROLE_ADMIN']}
    },

    // Subscription Management
    {
        path: '/entrepreneur/subscriptions',
        name: 'EntrepreneurSubscriptions',
        component:SubscriptionComponent,
        meta: { requiresAuth: true, role: 'entrepreneur' && ['ROLE_ADMIN']}
    },

]