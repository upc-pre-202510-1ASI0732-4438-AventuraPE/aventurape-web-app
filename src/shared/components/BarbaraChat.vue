<template>
  <div class="barbara-chat-container">
    <!-- Botón flotante para abrir/cerrar chat -->
    <div 
      class="chat-toggle" 
      @click="toggleChat"
      :class="{ 'chat-toggle-large': isOpen && isMaximized, 'hovered': isToggleHovered }"
      @mouseenter="isToggleHovered = true" @mouseleave="isToggleHovered = false"
    >
      <div class="avatar-glow">
        <img
          src="https://i.ibb.co/ymf4N6vQ/Imagen-de-Whats-App-2025-07-05-a-las-22-32-33-5626ea5e.jpg"
          alt="Barbara Avatar"
          class="avatar-img"
        />
      </div>
      <span v-if="unreadMessages > 0" class="notification-badge">{{ unreadMessages }}</span>
    </div>

    <!-- Ventana de chat -->
    <div 
      v-if="isOpen" 
      class="chat-window" 
      :class="{ 'maximized': isMaximized, 'fullscreen': isFullscreen }"
    >
      <div class="chat-header">
        <div class="chat-header-content">
          <div class="chat-avatar" @mouseenter="isHeaderAvatarHovered = true" @mouseleave="isHeaderAvatarHovered = false" :class="{ 'hovered': isHeaderAvatarHovered }">
            <img
              src="https://i.ibb.co/ymf4N6vQ/Imagen-de-Whats-App-2025-07-05-a-las-22-32-33-5626ea5e.jpg"
              alt="Barbara Avatar"
              class="avatar-img"
            />
          </div>
          <div class="chat-info">
            <h3>Barbara - Asistente Virtual</h3>
            <span class="chat-status">En línea</span>
          </div>
        </div>
        <div class="header-actions">
          <button @click="toggleMaximize" class="icon-btn" :title="isMaximized ? 'Reducir' : 'Agrandar'">
            <font-awesome-icon :icon="isMaximized ? 'compress' : 'window-maximize'" class="icon-action" />
          </button>
          <button @click="toggleFullscreen" class="icon-btn" :title="isFullscreen ? 'Salir pantalla completa' : 'Pantalla completa'">
            <font-awesome-icon :icon="isFullscreen ? 'window-restore' : 'expand-arrows-alt'" class="icon-action" />
          </button>
          <button @click="toggleChat" class="icon-btn" title="Cerrar">
            <font-awesome-icon icon="times" class="icon-action" />
          </button>
        </div>
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
        <button class="send-icon-btn" @click="sendMessage" :disabled="isLoading || !currentMessage.trim()">
          <font-awesome-icon icon="paper-plane" :class="['send-icon-minimal', { 'disabled': isLoading || !currentMessage.trim() }]" />
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
      isMaximized: false,
      isFullscreen: false,
      isToggleHovered: false,
      isHeaderAvatarHovered: false,
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
      } else {
        this.isMaximized = false;
        this.isFullscreen = false;
      }
    },
    toggleMaximize() {
      if (this.isFullscreen) return; // No maximizar si está en pantalla completa
      if (!this.isMaximized) {
        this.isMaximized = true;
        this.isFullscreen = false;
      } else {
        this.isMaximized = false;
      }
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    toggleFullscreen() {
      if (!this.isFullscreen) {
        this.isFullscreen = true;
        this.isMaximized = false;
      } else {
        this.isFullscreen = false;
      }
      this.$nextTick(() => {
        this.scrollToBottom();
      });
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
  transition: all 0.3s cubic-bezier(.4,1.4,.6,1.0);
  position: relative;
  color: var(--white);
  border: none;
  padding: 0;
}

.chat-toggle.hovered {
  transform: scale(1.18);
  box-shadow: 0 0 24px 8px #ffd70080, 0 0 40px 12px #ffd70040;
  z-index: 1100;
}

.avatar-glow {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  box-shadow: 0 0 0 0 #ffd70080, 0 0 16px 4px #ffd70040;
  animation: gold-glow 2.5s infinite alternate;
}

@keyframes gold-glow {
  0% {
    box-shadow: 0 0 0 0 #ffd70080, 0 0 16px 4px #ffd70040;
  }
  100% {
    box-shadow: 0 0 12px 4px #ffd700cc, 0 0 32px 8px #ffd70060;
  }
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2.5px solid #fffbe6;
  box-shadow: 0 0 8px 2px #ffd70060;
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
  transition: width 0.3s, height 0.3s, left 0.3s, right 0.3s, bottom 0.3s, top 0.3s;
}

.chat-window.maximized {
  width: 90vw;
  height: 90vh;
  max-width: 900px;
  max-height: 700px;
  left: 50%;
  top: 50%;
  right: auto;
  bottom: auto;
  transform: translate(-50%, -50%);
  z-index: 2000;
}

.chat-window.fullscreen {
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  transform: none;
  border-radius: 0;
  z-index: 3000;
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
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(.4,1.4,.6,1.0), box-shadow 0.25s;
}

.chat-avatar.hovered {
  transform: scale(1.18);
  box-shadow: 0 0 24px 8px #ffd70080, 0 0 40px 12px #ffd70040;
  z-index: 1100;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.icon-btn {
  background: none;
  border: none;
  color: var(--primary-light);
  cursor: pointer;
  font-size: 18px;
  padding: 4px 6px;
  border-radius: 50%;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-btn:hover {
  background: rgba(255, 255, 255, 0.13);
  color: var(--primary-color);
}
.icon-action {
  font-size: 18px;
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

.send-icon-btn {
  background: none;
  border: none;
  padding: 0 6px;
  margin-left: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  transition: color 0.2s, opacity 0.2s;
}
.send-icon-btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}
.send-icon-minimal {
  font-size: 22px;
  color: var(--primary-color);
  transition: color 0.2s, transform 0.2s, opacity 0.2s;
}
.send-icon-minimal.disabled {
  opacity: 0.4;
}
.send-icon-btn:not(:disabled):hover .send-icon-minimal {
  color: #bfa14a;
  transform: scale(1.18) rotate(-18deg);
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
@media (max-width: 600px) {
  .chat-window {
    width: calc(100vw - 20px);
    height: calc(100vh - 60px);
    right: -10px;
  }
  .chat-window.maximized {
    width: 99vw;
    height: 99vh;
    max-width: none;
    max-height: none;
  }
  .chat-window.fullscreen {
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    max-width: none;
    max-height: none;
    border-radius: 0;
  }
  .chat-toggle {
    width: 48px;
    height: 48px;
  }
  .avatar-glow {
    width: 36px;
    height: 36px;
  }
  .send-icon-btn {
    padding: 0 2px;
  }
  .send-icon-minimal {
    font-size: 18px;
  }
  .chat-avatar {
    width: 28px;
    height: 28px;
  }
  .icon-action {
    font-size: 16px;
  }
}
</style> 