import http from "@/shared/services/http-common.js";

export class Profile {

    //ENTREPRENEUR

    getProfileEntrepreneur() {
        return http.get('/profiles/entrepreneur');
    }
    getProfileEntrepreneurByProfileId(profileId) {
        return http.get(`/profiles/entrepreneur/${profileId}`);
    }
    getProfileEntrepreneurByUserId(userId) {
        return http.get(`/profiles/entrepreneur/user/${userId}`);
    }
    postProfileEntrepreneur(userId, profileData) {
        return http.post(`/profiles/entrepreneur/${userId}`, profileData);
    }

    //ADVENTURER

    getProfileAdventurer() {
        return http.get('/profiles/adventurer');
    }
    getProfileAdventurerByProfileId(profileId) {
        return http.get(`/profiles/adventurer/${profileId}`);
    }
    getProfileAdventurerByUserId(userId) {
        return http.get(`/profiles/adventurer/user/${userId}`);
    }
    postProfileAdventurer(userId, profileData) {
        return http.post(`/profiles/adventurer/${userId}`, profileData);
    }


}