import http from './http-common.js';

const BARBARA_NEXUS_BASE_URL = 'https://barbara-nexus.onrender.com';

class BarbaraNexusService {
    constructor() {
        this.baseURL = BARBARA_NEXUS_BASE_URL;
        this.currentRequest = null; // Para cancelar requests anteriores
    }

    /**
     * Envía un mensaje al chatbot Barbara Nexus
     * @param {string} message - El mensaje del usuario
     * @param {string} userId - ID único del usuario
     * @param {AbortSignal} signal - Señal para cancelar el request
     * @returns {Promise} Respuesta del chatbot
     */
    async sendMessage(message, userId, signal = null) {
        // Cancelar request anterior si existe
        if (this.currentRequest) {
            this.currentRequest.abort();
        }

        try {
            const controller = new AbortController();
            this.currentRequest = controller;

            // Si se proporciona una señal externa, escuchar su cancelación
            if (signal) {
                signal.addEventListener('abort', () => {
                    controller.abort();
                });
            }

            const response = await fetch(`${this.baseURL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    user_id: userId
                }),
                signal: controller.signal
            });

            // Verificar si el request fue cancelado
            if (controller.signal.aborted) {
                throw new Error('Request cancelado');
            }

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            // Solo loggear errores que no sean de cancelación
            if (error.name !== 'AbortError' && error.message !== 'Request cancelado') {
                console.error('Error al comunicarse con Barbara Nexus:', error);
            }
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.currentRequest = null;
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

    /**
     * Cancela el request actual si existe
     */
    cancelCurrentRequest() {
        if (this.currentRequest) {
            this.currentRequest.abort();
            this.currentRequest = null;
        }
    }
}

export default new BarbaraNexusService(); 