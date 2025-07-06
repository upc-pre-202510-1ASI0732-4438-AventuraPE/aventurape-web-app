import { defineStore } from 'pinia';
import BarbaraNexusService from '@/shared/services/barbara-nexus.service.js';
import Cookies from 'js-cookie';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    isOpen: false,
    isLoading: false,
    unreadCount: 0,
    userId: null,
    isConnected: false
  }),

  getters: {
    hasUnreadMessages: (state) => state.unreadCount > 0,
    lastMessage: (state) => state.messages[state.messages.length - 1]
  },

  actions: {
    async sendMessage(message) {
      if (!this.userId) {
        this.userId = Cookies.get('userId') || `guest_${Date.now()}`;
      }

      this.isLoading = true;
      
      try {
        const response = await BarbaraNexusService.sendMessage(message, this.userId);
        
        if (response.success) {
          this.addMessage({
            text: response.data.response,
            type: 'bot',
            timestamp: new Date()
          });
          this.isConnected = true;
        } else {
          this.addMessage({
            text: 'Error al procesar el mensaje',
            type: 'bot',
            timestamp: new Date()
          });
        }
      } catch (error) {
        this.addMessage({
          text: 'Error de conexión',
          type: 'bot',
          timestamp: new Date()
        });
        this.isConnected = false;
      } finally {
        this.isLoading = false;
      }
    },

    addMessage(message) {
      this.messages.push(message);
      if (!this.isOpen) {
        this.unreadCount++;
      }
    },

    toggleChat() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.unreadCount = 0;
      }
    },

    setUserId(userId) {
      this.userId = userId;
    },

    async checkConnection() {
      try {
        this.isConnected = await BarbaraNexusService.checkHealth();
      } catch (error) {
        this.isConnected = false;
      }
    },

    clearMessages() {
      this.messages = [];
      this.unreadCount = 0;
    },

    addWelcomeMessage() {
      this.addMessage({
        text: '¡Hola! Soy Barbara, tu asistente virtual de AventuraPe. ¿En qué puedo ayudarte hoy? Puedo recomendarte aventuras, ayudarte a encontrar actividades o responder cualquier pregunta sobre turismo en Perú.',
        type: 'bot',
        timestamp: new Date()
      });
    }
  }
}); 