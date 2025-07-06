import http from './http-common.js';

const BARBARA_NEXUS_BASE_URL = 'https://barbara-nexus.onrender.com';

class BarbaraNexusService {
    constructor() {
        this.baseURL = BARBARA_NEXUS_BASE_URL;
    }

    /**
     * Envía un mensaje al chatbot Barbara Nexus
     * @param {string} message - El mensaje del usuario
     * @param {string} userId - ID único del usuario
     * @returns {Promise} Respuesta del chatbot
     */
    async sendMessage(message, userId) {
        try {
            const response = await fetch(`${this.baseURL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    user_id: userId
                })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error al comunicarse con Barbara Nexus:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Verifica el estado del servicio Barbara Nexus
     * @returns {Promise} Estado del servicio
     */
    async checkHealth() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return response.ok;
        } catch (error) {
            console.error('Error al verificar salud de Barbara Nexus:', error);
            return false;
        }
    }
}

export default new BarbaraNexusService(); 