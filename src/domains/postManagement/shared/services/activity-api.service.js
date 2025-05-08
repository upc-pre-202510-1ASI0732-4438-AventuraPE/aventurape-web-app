import http from "@/shared/services/http-common.js";

export class ActivityApiService {
    // Obtener todas las publicaciones
    async getAllActivities() {
        return http.get('/publication/all-publications');
    }

    // Obtener una publicación específica por ID
    async getActivityById(id) {
        return http.get(`/publication/${id}`);
    }

    // Publicar un comentario en una actividad
    async postComment(id, comment) {
        return http.post(`/publication/${id}/add-comment`, comment);
    }

    // Eliminar un comentario de una actividad
    async deleteComment(publicationId, commentId) {
        return http.delete(`/publication/${publicationId}/comments/${commentId}`);
    }

    // Obtener todos los comentarios de una publicación
    async getCommentsByActivityId(id) {
        return http.get(`/publication/${id}/comments`);
    }

    // src/domains/postManagement/shared/services/activity-api.service.js
    async getUserById(userId) {
        return http.get(`/users/${userId}`);
    }

    // Obtener todas las publicaciones de un emprendedor
    async getAllActivitiesByEntrepreneurId(id) {
        return http.get(`/publication/${id}/publications`);
    }
    async postPublication(publication) {
        return http.post('/publication/create-publication', publication);
    }
    async deletePublication(id) {
        return http.delete(`/publication/${id}/delete-publication`);
    }
    async updatePublication(id, publication) {
        return http.put(`/publication/${id}/update-publication`, publication);
    }

    async getAllEntrepreneurs() {
        // Obtener token desde localStorage o cookies
        const token = localStorage.getItem('token') || Cookies.get('token');

        // Configurar los headers con el token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        return http.get('/users/entrepreneurs', config);
    }

    // Obtener todos los usuarios
    async getAllUsers() {
        return http.get('/users');
    }

    // Añadir una publicación a favoritos
    // /api/v1/favorite-publications/create-favorite-publication
    async addToFavorites(favoritePublication) {
        return http.post('/favorite-publications/create-favorite-publication', favoritePublication);
    }


    // Eliminar una publicación de favoritos
    async removeFromFavorites(favoriteId) {
        return http.delete(`/favorite-publications/delete-favorite-publication/${favoriteId}`);
    }

    // Obtener las publicaciones favoritas del usuario
///api/v1/favorite-publications/getFavoritePublicationByProfileId/{profileId}
    async getFavoritePublicationsByProfileId(userId) {
        return http.get(`/favorite-publications/getFavoritePublicationByProfileId/${userId}`);
    }
}