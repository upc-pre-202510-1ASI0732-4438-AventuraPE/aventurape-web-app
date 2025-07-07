import { defineStore } from 'pinia';
import BarbaraNexusService from '@/shared/services/barbara-nexus.service.js';
import Cookies from 'js-cookie';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    isOpen: false,
    isLoading: false,
    isSubmitting: false,
    unreadCount: 0,
    userId: null,
    isConnected: false,
    currentRequest: null,
    welcomeMessageAdded: false
  }),

  getters: {
    hasUnreadMessages: (state) => state.unreadCount > 0,
    lastMessage: (state) => state.messages[state.messages.length - 1]
  },

  actions: {
    async sendMessage(message) {
      if (this.isSubmitting || this.isLoading || !message.trim()) {
        return;
      }

      if (!this.userId) {
        this.userId = Cookies.get('userId') || `guest_${Date.now()}`;
      }

      if (this.currentRequest) {
        this.currentRequest.abort();
      }

      this.isSubmitting = true;
      this.isLoading = true;
      
      try {
        const controller = new AbortController();
        this.currentRequest = controller;

        const response = await BarbaraNexusService.sendMessage(message, this.userId, controller.signal);
        
        if (controller.signal.aborted) {
          return;
        }
        
        if (response.success) {
          this.addMessage({
            id: `store-bot-${Date.now()}-${Math.random()}`,
            text: response.data.response,
            type: 'bot',
            timestamp: new Date()
          });
          this.isConnected = true;
        } else {
          this.addMessage({
            id: `store-error-${Date.now()}-${Math.random()}`,
            text: 'Error al procesar el mensaje',
            type: 'bot',
            timestamp: new Date()
          });
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          this.addMessage({
            id: `store-connection-error-${Date.now()}-${Math.random()}`,
            text: 'Error de conexión',
            type: 'bot',
            timestamp: new Date()
          });
          this.isConnected = false;
        }
      } finally {
        this.isLoading = false;
        this.isSubmitting = false;
        this.currentRequest = null;
      }
    },

    addMessage(message) {
      if (message.id && this.messages.some(m => m.id === message.id)) {
        return;
      }
      
      const lastMessage = this.messages[this.messages.length - 1];
      if (lastMessage && 
          lastMessage.text === message.text && 
          lastMessage.type === message.type &&
          Math.abs(lastMessage.timestamp.getTime() - message.timestamp.getTime()) < 2000) {
        return;
      }
      
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
      this.welcomeMessageAdded = false;
    },

    cancelCurrentRequest() {
      if (this.currentRequest) {
        this.currentRequest.abort();
        this.currentRequest = null;
      }
      this.isLoading = false;
      this.isSubmitting = false;
    }
  }
}); 