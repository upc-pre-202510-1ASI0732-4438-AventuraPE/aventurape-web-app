import http from "@/shared/services/http-common.js";

export class Profile {

    // ENTREPRENEUR METHODS
    getEntrepreneurProfiles() {
        return http.get('/profiles/entrepreneur');
    }

    getEntrepreneurProfileById(profileId) {
        return http.get(`/profiles/entrepreneur/${profileId}`);
    }

    getEntrepreneurProfileByUserId(userId) {
        return http.get(`/profiles/entrepreneur/user/${userId}`);
    }

    createEntrepreneurProfile(data) {
        return http.post('/profiles/entrepreneur', data);
    }

    //ADVENTURER

    // ADVENTURER METHODS
    getAdventurerProfiles() {
        return http.get('/profiles/adventurer');
    }

    getAdventurerProfileById(profileId) {
        return http.get(`/profiles/adventurer/${profileId}`);
    }

    getEntrepreneurProfiles() {
        return http.get('/profiles/entrepreneur');
    }

    // Obtener perfil de aventurero por ID de usuario
    getAdventurerProfileByUserId(userId) {
        return http.get(`/profiles/adventurer/user/${userId}`);
    }

    // Crear perfil
    createAdventurerProfile(data) {
        return http.post('/profiles/adventurer', data);
    }

    /*// Actualizar perfil
    updateAdventurerProfile(profileId, data) {
        return http.put(`/profiles/adventurer/${profileId}`, data);
    }*/
    getUserById(userId) {
        return http.get(`/users/${userId}`);
    }

}