import ProfileAvComponent from "@/domains/profileManagement/adventurer/views/profileAv.component.vue";
import StatisticsComponent from "@/domains/statisticsManagement/entrepreneur/views/statistics.component.vue";
import SubscriptionComponent from "@/domains/subscriptionManagement/entrepreneur/views/subscription.component.vue";

export default [
    // Profile Management
    {
        path: '/entrepreneur/profile',
        name: 'EntrepreneurProfile',
        component: ProfileAvComponent,
        meta: { requiresAuth: true, role: 'entrepreneur' }
    },

    // Statistics Management
    {
        path: '/entrepreneur/statistics',
        name: 'EntrepreneurStatistics',
        component:StatisticsComponent,
        meta: { requiresAuth: true, role: 'entrepreneur' }
    },

    // Subscription Management
    {
        path: '/entrepreneur/subscriptions',
        name: 'EntrepreneurSubscriptions',
        component:SubscriptionComponent,
        meta: { requiresAuth: true, role: 'entrepreneur' }
    },

]