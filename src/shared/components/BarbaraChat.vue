<template>
  <div class="barbara-chat-container">
    <!-- Botón flotante para abrir/cerrar chat -->
    <div class="chat-toggle" @click="toggleChat">
      <font-awesome-icon icon="comments" />
      <span v-if="unreadMessages > 0" class="notification-badge">{{ unreadMessages }}</span>
    </div>

    <!-- Ventana de chat -->
    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <div class="chat-header-content">
          <div class="chat-avatar">
            <font-awesome-icon icon="robot" />
          </div>
          <div class="chat-info">
            <h3>Barbara - Asistente Virtual</h3>
            <span class="chat-status">En línea</span>
          </div>
        </div>
        <button @click="toggleChat" class="close-btn">
          <font-awesome-icon icon="times" />
        </button>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div 
          v-for="(message, index) in messages" 
          :key="index" 
          :class="['message', message.type]"
        >
          <div class="message-content">
            <div class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>
        
        <div v-if="isLoading" class="message bot">
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <input 
          v-model="currentMessage" 
          @keyup.enter="sendMessage"
          placeholder="Escribe tu mensaje..."
          :disabled="isLoading"
        />
        <button @click="sendMessage" :disabled="isLoading || !currentMessage.trim()">
          <font-awesome-icon icon="paper-plane" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import BarbaraNexusService from '@/shared/services/barbara-nexus.service.js';
import Cookies from 'js-cookie';

export default {
  name: 'BarbaraChat',
  data() {
    return {
      isOpen: false,
      messages: [],
      currentMessage: '',
      isLoading: false,
      unreadMessages: 0,
      userId: null
    };
  },
  
  async mounted() {
    // Obtener ID del usuario autenticado
    this.userId = Cookies.get('userId') || `guest_${Date.now()}`;
    
    // Mensaje de bienvenida
    this.addMessage({
      text: '¡Hola! Soy Barbara, tu asistente virtual de AventuraPe. ¿En qué puedo ayudarte hoy? Puedo recomendarte aventuras, ayudarte a encontrar actividades o responder cualquier pregunta sobre turismo en Perú.',
      type: 'bot',
      timestamp: new Date()
    });
  },

  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.unreadMessages = 0;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    async sendMessage() {
      if (!this.currentMessage.trim() || this.isLoading) return;

      const userMessage = this.currentMessage.trim();
      this.addMessage({
        text: userMessage,
        type: 'user',
        timestamp: new Date()
      });

      this.currentMessage = '';
      this.isLoading = true;

      try {
        const response = await BarbaraNexusService.sendMessage(userMessage, this.userId);
        
        if (response.success) {
          this.addMessage({
            text: response.data.response,
            type: 'bot',
            timestamp: new Date()
          });
        } else {
          this.addMessage({
            text: 'Lo siento, no pude procesar tu mensaje. Inténtalo de nuevo.',
            type: 'bot',
            timestamp: new Date()
          });
        }
      } catch (error) {
        this.addMessage({
          text: 'Error de conexión. Verifica tu internet e inténtalo de nuevo.',
          type: 'bot',
          timestamp: new Date()
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    addMessage(message) {
      this.messages.push(message);
      if (!this.isOpen) {
        this.unreadMessages++;
      }
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.barbara-chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.chat-toggle {
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  position: relative;
  color: var(--white);
}

.chat-toggle:hover {
  background: var(--primary-light);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(118, 85, 50, 0.3);
}

.chat-toggle svg {
  font-size: 24px;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--error-color);
  color: var(--white);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 380px;
  height: 550px;
  background: var(--white);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(118, 85, 50, 0.1);
}

.chat-header {
  background: var(--primary-color);
  color: var(--white);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-avatar svg {
  font-size: 20px;
}

.chat-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.chat-status {
  font-size: 12px;
  opacity: 0.8;
}

.close-btn {
  background: none;
  border: none;
  color: var(--white);
  cursor: pointer;
  font-size: 18px;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: var(--primary-lighter);
}

.message {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  position: relative;
}

.message.user {
  align-self: flex-end;
  background: var(--primary-color);
  color: var(--white);
  border-bottom-right-radius: 6px;
}

.message.bot {
  align-self: flex-start;
  background: var(--white);
  color: var(--text-dark);
  border: 1px solid rgba(118, 85, 50, 0.1);
  border-bottom-left-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-text {
  margin-bottom: 5px;
  line-height: 1.4;
  font-size: 14px;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  align-self: flex-end;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: var(--primary-light);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.chat-input {
  padding: 20px;
  border-top: 1px solid rgba(118, 85, 50, 0.1);
  display: flex;
  gap: 12px;
  background: var(--white);
}

.chat-input input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid rgba(118, 85, 50, 0.1);
  border-radius: 25px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.3s;
  background: var(--primary-lighter);
}

.chat-input input:focus {
  border-color: var(--primary-color);
}

.chat-input input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.chat-input button {
  width: 45px;
  height: 45px;
  background: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.chat-input button:hover:not(:disabled) {
  background: var(--primary-light);
  transform: scale(1.05);
}

.chat-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.chat-input button svg {
  font-size: 16px;
}

/* Scrollbar personalizado */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(118, 85, 50, 0.2);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(118, 85, 50, 0.3);
}

/* Responsive */
@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 40px);
    height: calc(100vh - 120px);
    right: -10px;
  }
  
  .chat-toggle {
    width: 55px;
    height: 55px;
  }
  
  .chat-toggle svg {
    font-size: 20px;
  }
}
</style> 