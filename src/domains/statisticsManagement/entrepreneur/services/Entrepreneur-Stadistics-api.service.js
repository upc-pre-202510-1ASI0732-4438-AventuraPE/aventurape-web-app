import http from "@/shared/services/http-common.js";

export class EntrepreneurStadisticsApiService {
    // Obtener todas las publicaciones mejor rateadas de un emprendedor
    async getAllActivitiesOrderByRatingByEntrepreneurId(id) {
        return http.get(`/publication/order-by-rating/${id}`);
    }
}