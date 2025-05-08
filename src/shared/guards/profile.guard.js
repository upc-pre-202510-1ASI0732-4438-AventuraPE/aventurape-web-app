import { Profile } from "@/domains/profileManagement/shared/services/profile-api.service.js";
export const profileGuard = async (to, from, next) => {
    // Skip guard for auth-related and profile pages
    const publicPages = ['/sign-in', '/sign-up', '/profile-adventurer', '/profile-entrepreneur'];
    if (publicPages.includes(to.path)) {
        return next();
    }

    // Check authentication
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) {
        return next('/sign-in');
    }

    try {
        const profileService = new Profile();
        const userRoles = JSON.parse(localStorage.getItem("userRoles")) || [];
        let profileStatus;

        // Check profile based on role
        if (userRoles.includes('ROLE_ENTREPRENEUR')) {
            profileStatus = await profileService.getEntrepreneurProfileByUserId(userId);
        } else {
            profileStatus = await profileService.getAdventurerProfileByUserId(userId);
        }

        // Use localStorage instead of store
        if (!profileStatus || !profileStatus.data || profileStatus.status === 404) {
            localStorage.setItem('profileRequired', 'true');
            if (userRoles.includes('ROLE_ENTREPRENEUR')) {
                return next('/profile-entrepreneur');
            } else {
                return next('/profile-adventurer');
            }
        }

        localStorage.setItem('profileRequired', 'false');
        return next();
    } catch (error) {
        localStorage.setItem('profileRequired', 'true');
        const userRoles = JSON.parse(localStorage.getItem("userRoles")) || [];
        if (userRoles.includes('ROLE_ENTREPRENEUR')) {
            return next('/profile-entrepreneur');
        } else {
            return next('/profile-adventurer');
        }
    }
};