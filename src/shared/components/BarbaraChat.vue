<template>
  <div class="barbara-chat-container">
    <!-- Botón flotante futurista para abrir/cerrar chat -->
    <div 
      class="chat-toggle" 
      @click="toggleChat"
      :class="{ 'active': isOpen, 'hovered': isToggleHovered }"
      @mouseenter="isToggleHovered = true" 
      @mouseleave="isToggleHovered = false"
    >
      <div class="holographic-ring"></div>
      <div class="neural-core">
        <div class="avatar-container">
          <img
            src="https://i.ibb.co/ymf4N6vQ/Imagen-de-Whats-App-2025-07-05-a-las-22-32-33-5626ea5e.jpg"
            alt="Barbara  Assistant"
            class="neural-avatar"
          />
          <div class="ai-pulse"></div>
        </div>
      </div>
      <span v-if="unreadMessages > 0" class="neural-notification">{{ unreadMessages }}</span>
    </div>

    <!-- Ventana de chat futurista -->
    <div 
      v-if="isOpen" 
      class="neural-chat-window" 
      :class="{ 
        'maximized': isMaximized, 
        'fullscreen': isFullscreen,
        'dark-mode': $parent.isDarkMode
      }"
    >
      <!-- Header con diseño holográfico -->
      <div class="neural-header">
        <div class="neural-header-bg"></div>
        <div class="header-content">
          <div class="ai-avatar-section">
            <div class="neural-avatar-frame" 
                 @mouseenter="isHeaderAvatarHovered = true" 
                 @mouseleave="isHeaderAvatarHovered = false" 
                 :class="{ 'enhanced': isHeaderAvatarHovered }">
              <div class="quantum-border"></div>
              <img
                src="https://i.ibb.co/ymf4N6vQ/Imagen-de-Whats-App-2025-07-05-a-las-22-32-33-5626ea5e.jpg"
                alt="Barbara Neural Assistant"
                class="neural-avatar-header"
              />
              <div class="energy-orb"></div>
            </div>
            <div class="ai-identity">
              <h3 class="neural-title">Barbara Neural Assistant</h3>
              <div class="status-indicator">
                <div class="quantum-dot"></div>
                <span class="neural-status">Sistema Activo</span>
              </div>
            </div>
          </div>
          <div class="neural-controls">
            <button @click="toggleMaximize" class="neural-btn" :title="isMaximized ? 'Reducir' : 'Expandir'">
              <div class="btn-glow"></div>
              <span class="neural-icon">{{ isMaximized ? '⊟' : '⊞' }}</span>
            </button>
            <button @click="toggleFullscreen" class="neural-btn" :title="isFullscreen ? 'Salir' : 'Pantalla Completa'">
              <div class="btn-glow"></div>
              <span class="neural-icon">{{ isFullscreen ? '⧉' : '⛶' }}</span>
            </button>
            <button @click="toggleChat" class="neural-btn close-btn" title="Desconectar">
              <div class="btn-glow"></div>
              <span class="neural-icon">✕</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Área de mensajes con efecto holográfico -->
      <div class="neural-messages" ref="messagesContainer">
        <div class="neural-background"></div>
        <div 
          v-for="(message, index) in messages" 
          :key="`neural-msg-${index}-${message.timestamp.getTime()}-${message.id || Math.random()}`" 
          :class="['neural-message', message.type, { 'materializing': message.isNew }]"
        >
          <div class="message-hologram">
            <div class="message-core">
              <div class="message-text">{{ message.text }}</div>
              <div class="message-metadata">
                <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
                <div class="quantum-signature"></div>
              </div>
            </div>
            <div class="message-aura"></div>
          </div>
        </div>
        
        <!-- Indicador de procesamiento neural -->
        <div v-if="isLoading" class="neural-message bot processing">
          <div class="message-hologram">
            <div class="message-core">
              <div class="neural-thinking">
                <div class="brain-wave">
                  <div class="synapse" v-for="n in 6" :key="n" :style="{ animationDelay: `${n * 0.1}s` }"></div>
                </div>
                <span class="processing-text">Procesando datos neurales...</span>
              </div>
            </div>
            <div class="message-aura processing-aura"></div>
          </div>
        </div>
      </div>

      <!-- Input futurista -->
      <div class="neural-input-zone">
        <div class="input-hologram"></div>
        <form class="quantum-input" @submit.prevent="handleSubmit">
          <div class="input-field-container">
            <input 
              v-model="currentMessage" 
              placeholder="Transmite tu consulta neural..."
              :disabled="isLoading || isSubmitting"
              ref="messageInput"
              class="neural-field"
            />
            <div class="field-energy"></div>
          </div>
          <button 
            type="submit" 
            class="quantum-transmitter" 
            :disabled="isLoading || isSubmitting || !currentMessage.trim()"
            :class="{ 'ready': currentMessage.trim() && !isLoading && !isSubmitting }"
          >
            <div class="transmitter-core">
              <div class="energy-rings"></div>
              <span class="transmission-icon">➤</span>
            </div>
          </button>
        </form>
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
      isSubmitting: false,
      unreadMessages: 0,
      userId: null,
      currentRequest: null,
      welcomeMessageAdded: false
    };
  },
  
  async mounted() {
    this.userId = Cookies.get('userId') || `neural_${Date.now()}`;
    this.addWelcomeMessage();
  },

  methods: {
    addWelcomeMessage() {
      if (this.welcomeMessageAdded) return;
      
      this.addMessage({
        id: 'welcome-message',
        text: '🤖 Sistemas neurales activados. Soy Barbara, tu asistente de IA para AventuraPe. Mi base de datos contiene información sobre experiencias únicas en Perú. ¿Qué aventura deseas explorar?',
        type: 'bot',
        timestamp: new Date(),
        isNew: true
      });
      
      this.welcomeMessageAdded = true;
    },

    toggleChat() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.unreadMessages = 0;
        this.addWelcomeMessage();
        this.$nextTick(() => {
          this.scrollToBottom();
          this.$refs.messageInput?.focus();
        });
      }
    },

    toggleMaximize() {
      this.isMaximized = !this.isMaximized;
      if (this.isMaximized) {
        this.isFullscreen = false;
      }
    },

    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
      if (this.isFullscreen) {
        this.isMaximized = false;
      }
    },

    async handleSubmit() {
      if (this.isSubmitting || this.isLoading || !this.currentMessage.trim()) {
        return;
      }
      await this.sendMessage();
    },

    async sendMessage() {
      if (this.isSubmitting || this.isLoading || !this.currentMessage.trim()) {
        return;
      }

      const userMessage = this.currentMessage.trim();
      this.currentMessage = '';

      if (this.currentRequest) {
        this.currentRequest.abort();
      }

      this.isSubmitting = true;
      this.isLoading = true;

      this.addMessage({
        id: `user-${Date.now()}-${Math.random()}`,
        text: userMessage,
        type: 'user',
        timestamp: new Date(),
        isNew: true
      });

      try {
        const controller = new AbortController();
        this.currentRequest = controller;

        const response = await BarbaraNexusService.sendMessage(userMessage, this.userId, controller.signal);
        
        if (controller.signal.aborted) {
          return;
        }
        
        if (response.success) {
          this.addMessage({
            id: `bot-${Date.now()}-${Math.random()}`,
            text: response.data.response,
            type: 'bot',
            timestamp: new Date(),
            isNew: true
          });
        } else {
          this.addMessage({
            id: `error-${Date.now()}-${Math.random()}`,
            text: '⚡ Error en la transmisión neural. Reintentando conexión...',
            type: 'bot',
            timestamp: new Date(),
            isNew: true
          });
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          this.addMessage({
            id: `connection-error-${Date.now()}-${Math.random()}`,
            text: '🔌 Conexión neural interrumpida. Verificando sistemas...',
            type: 'bot',
            timestamp: new Date(),
            isNew: true
          });
        }
      } finally {
        this.isLoading = false;
        this.isSubmitting = false;
        this.currentRequest = null;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
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
/* ===== NEURAL CHAT INTERFACE - FUTURISTIC DESIGN ===== */

/* Prevenir desplazamientos no deseados */
.barbara-chat-container * {
  box-sizing: border-box;
}

.barbara-chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  pointer-events: none;
}

.barbara-chat-container > * {
  pointer-events: all;
}

/* ===== BOTÓN FLOTANTE FUTURISTA ===== */
.chat-toggle {
  width: 75px;
  height: 75px;
  background: linear-gradient(135deg, var(--primary-color, #765532) 0%, #8a6640 50%, var(--primary-color, #765532) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  border: none;
  padding: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 32px rgba(118, 85, 50, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(118, 85, 50, 0.2);
}

.chat-toggle:hover {
  transform: scale(1.1) translateY(-3px);
  box-shadow: 
    0 12px 40px rgba(118, 85, 50, 0.4),
    0 0 30px rgba(255, 215, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.chat-toggle.active {
  background: linear-gradient(135deg, #8a6640 0%, var(--primary-color, #765532) 50%, #9b7249 100%);
  transform: scale(1.05);
}

.holographic-ring {
  position: absolute;
  width: 85px;
  height: 85px;
  border: 2px solid transparent;
  border-radius: 50%;
  background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.4), transparent, rgba(255, 215, 0, 0.2));
  animation: neural-rotate 4s linear infinite;
  opacity: 0.7;
}

@keyframes neural-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.neural-core {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-container {
  position: relative;
  width: 50px;
  height: 50px;
}

.neural-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid rgba(255, 215, 0, 0.6);
  transition: all 0.3s ease;
}

.ai-pulse {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.3), transparent);
  animation: ai-pulse 2s ease-in-out infinite;
}

@keyframes ai-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.neural-notification {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ff4757, #ff3838);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.4);
  animation: notification-pulse 1.5s ease-in-out infinite;
}

@keyframes notification-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* ===== VENTANA DE CHAT NEURAL ===== */
.neural-chat-window {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 450px;
  height: 650px;
  max-height: calc(100vh - 120px);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(248, 245, 240, 0.95));
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(118, 85, 50, 0.2);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: bottom right;

  /* Asegurar que permanezca en posición fija */
  will-change: transform;
  contain: layout style paint;
}

.neural-chat-window.maximized {
  width: 90vw;
  height: 90vh;
  max-width: 1100px;
  max-height: 850px;
  left: 50%;
  top: 50%;
  right: auto;
  bottom: auto;
  transform: translate(-50%, -50%);
  z-index: 2000;
  position: fixed;
}

.neural-chat-window.fullscreen {
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border-radius: 0;
  z-index: 3000;
  position: fixed;
  max-height: none;
  transform: none;
}

/* ===== HEADER HOLOGRÁFICO ===== */
.neural-header {
  position: relative;
  background: linear-gradient(135deg, var(--primary-color, #765532) 0%, #8a6640 100%);
  color: white;
  padding: 18px 24px;
  overflow: hidden;
}

.neural-header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.1), transparent);
  animation: header-shimmer 3s ease-in-out infinite;
}

@keyframes header-shimmer {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

.header-content {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}

.ai-avatar-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.neural-avatar-frame {
  position: relative;
  width: 45px;
  height: 45px;
  transition: all 0.3s ease;
}

.neural-avatar-frame.enhanced {
  transform: scale(1.1);
}

.quantum-border {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(255, 215, 0, 0.6), transparent, rgba(255, 215, 0, 0.4));
  animation: quantum-spin 2s linear infinite;
}

@keyframes quantum-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.neural-avatar-header {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  position: relative;
  z-index: 1;
}

.energy-orb {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: rgba(255, 215, 0, 0.8);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  animation: energy-pulse 1.5s ease-in-out infinite;
}

@keyframes energy-pulse {
  0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
}

.ai-identity {
  flex: 1;
}

.neural-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(45deg, #ffffff, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.quantum-dot {
  width: 8px;
  height: 8px;
  background: #00ff88;
  border-radius: 50%;
  animation: quantum-blink 2s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.6);
}

@keyframes quantum-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.neural-status {
  font-size: 12px;
  opacity: 0.9;
  font-weight: 500;
}

.neural-controls {
  display: flex;
  gap: 8px;
}

.neural-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  padding: 8px 10px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.neural-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.neural-btn.close-btn:hover {
  background: rgba(255, 71, 87, 0.3);
  box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.neural-btn:hover .btn-glow {
  left: 100%;
}

.neural-icon {
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  transition: all 0.3s ease;
}

.neural-btn:hover .neural-icon {
  transform: scale(1.1);
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
}

/* ===== ÁREA DE MENSAJES NEURAL ===== */
.neural-messages {
  position: relative;
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: linear-gradient(180deg, rgba(248, 245, 240, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%);
}

.neural-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(118, 85, 50, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 215, 0, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.neural-message {
  position: relative;
  max-width: 85%;
  transition: all 0.4s ease;
}

.neural-message.materializing {
  animation: message-materialize 0.5s ease-out;
}

@keyframes message-materialize {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.neural-message.user {
  align-self: flex-end;
}

.neural-message.bot {
  align-self: flex-start;
}

.message-hologram {
  position: relative;
  backdrop-filter: blur(10px);
  border-radius: 18px;
  overflow: hidden;
}

.neural-message.user .message-hologram {
  background: linear-gradient(135deg, var(--primary-color, #765532) 0%, #8a6640 100%);
  border: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 
    0 8px 32px rgba(118, 85, 50, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.neural-message.bot .message-hologram {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 245, 240, 0.8) 100%);
  border: 1px solid rgba(118, 85, 50, 0.2);
  box-shadow: 
    0 8px 32px rgba(118, 85, 50, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.message-core {
  padding: 16px 20px;
  position: relative;
}

.neural-message.user .message-core {
  color: white;
}

.neural-message.bot .message-core {
  color: var(--text-dark, #333);
}

.message-text {
  margin-bottom: 8px;
  line-height: 1.5;
  font-size: 14px;
  font-weight: 500;
}

.message-metadata {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  font-size: 11px;
  opacity: 0.7;
  font-weight: 600;
}

.quantum-signature {
  width: 12px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.6), transparent);
  border-radius: 1px;
  animation: signature-pulse 2s ease-in-out infinite;
}

@keyframes signature-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.message-aura {
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border-radius: 18px;
  background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.neural-message:hover .message-aura {
  opacity: 1;
}

/* ===== INDICADOR DE PROCESAMIENTO NEURAL ===== */
.neural-message.processing .message-hologram {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.neural-thinking {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.brain-wave {
  display: flex;
  gap: 4px;
  height: 20px;
  align-items: center;
}

.synapse {
  width: 6px;
  height: 6px;
  background: var(--primary-color, #765532);
  border-radius: 50%;
  animation: synapse-fire 1.5s ease-in-out infinite;
}

@keyframes synapse-fire {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.4); }
}

.processing-text {
  font-size: 13px;
  color: var(--primary-color, #765532);
  font-weight: 600;
}

.processing-aura {
  background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.2), transparent);
  animation: processing-shimmer 2s linear infinite;
}

@keyframes processing-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* ===== INPUT FUTURISTA ===== */
.neural-input-zone {
  position: relative;
  padding: 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 245, 240, 0.9) 100%);
  border-top: 1px solid rgba(118, 85, 50, 0.2);
  backdrop-filter: blur(20px);
}

.input-hologram {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.05), transparent);
  pointer-events: none;
  animation: input-shimmer 4s ease-in-out infinite;
}

@keyframes input-shimmer {
  0%, 100% { opacity: 0.5; transform: translateX(-100%); }
  50% { opacity: 1; transform: translateX(100%); }
}

.quantum-input {
  position: relative;
  display: flex;
  gap: 15px;
  align-items: center;
}

.input-field-container {
  position: relative;
  flex: 1;
}

.neural-field {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid rgba(118, 85, 50, 0.2);
  border-radius: 30px;
  outline: none;
  font-size: 14px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  color: var(--text-dark, #333);
}

.neural-field:focus {
  border-color: var(--primary-color, #765532);
  box-shadow: 
    0 0 0 3px rgba(118, 85, 50, 0.1),
    0 8px 32px rgba(118, 85, 50, 0.2);
  background: rgba(255, 255, 255, 0.95);
}

.neural-field:disabled {
  background: rgba(245, 245, 245, 0.6);
  cursor: not-allowed;
  opacity: 0.7;
}

.neural-field::placeholder {
  color: rgba(118, 85, 50, 0.6);
  font-style: italic;
}

.field-energy {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 30px;
  background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.neural-field:focus + .field-energy {
  opacity: 1;
}

.quantum-transmitter {
  position: relative;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, rgba(118, 85, 50, 0.8) 0%, var(--primary-color, #765532) 100%);
  border: 2px solid rgba(118, 85, 50, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.quantum-transmitter:disabled {
  background: rgba(200, 200, 200, 0.6);
  border-color: rgba(200, 200, 200, 0.4);
  cursor: not-allowed;
  opacity: 0.5;
}

.quantum-transmitter.ready {
  background: linear-gradient(135deg, var(--primary-color, #765532) 0%, #8a6640 100%);
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 
    0 0 20px rgba(255, 215, 0, 0.3),
    0 4px 15px rgba(118, 85, 50, 0.3);
}

.quantum-transmitter:not(:disabled):hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 
    0 0 25px rgba(255, 215, 0, 0.4),
    0 6px 20px rgba(118, 85, 50, 0.4);
}

.transmitter-core {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.energy-rings {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 215, 0, 0.4);
  border-radius: 50%;
  animation: energy-expand 2s ease-in-out infinite;
}

@keyframes energy-expand {
  0% { opacity: 1; transform: scale(0.8); }
  100% { opacity: 0; transform: scale(1.2); }
}

.transmission-icon {
  color: white;
  font-size: 16px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.quantum-transmitter.ready .transmission-icon {
  color: #ffd700;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.6));
}

/* ===== SCROLLBAR NEURAL ===== */
.neural-messages::-webkit-scrollbar {
  width: 8px;
}

.neural-messages::-webkit-scrollbar-track {
  background: rgba(118, 85, 50, 0.1);
  border-radius: 4px;
}

.neural-messages::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--primary-color, #765532), rgba(118, 85, 50, 0.8));
  border-radius: 4px;
  transition: background 0.3s ease;
}

.neural-messages::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #8a6640, var(--primary-color, #765532));
}

/* ===== DARK MODE ADAPTATIONS ===== */
.neural-chat-window.dark-mode {
  background: linear-gradient(145deg, rgba(42, 35, 24, 0.95), rgba(26, 22, 18, 0.95));
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.neural-chat-window.dark-mode .neural-messages {
  background: linear-gradient(180deg, rgba(42, 35, 24, 0.6) 0%, rgba(26, 22, 18, 0.4) 100%);
}

.neural-chat-window.dark-mode .neural-message.bot .message-hologram {
  background: linear-gradient(135deg, rgba(42, 35, 24, 0.9) 0%, rgba(26, 22, 18, 0.8) 100%);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.neural-chat-window.dark-mode .neural-message.bot .message-core {
  color: #f5f1eb;
}

.neural-chat-window.dark-mode .neural-input-zone {
  background: linear-gradient(180deg, rgba(42, 35, 24, 0.95) 0%, rgba(26, 22, 18, 0.9) 100%);
  border-top: 1px solid rgba(255, 215, 0, 0.2);
}

.neural-chat-window.dark-mode .neural-field {
  background: rgba(42, 35, 24, 0.8);
  border-color: rgba(255, 215, 0, 0.3);
  color: #f5f1eb;
}

.neural-chat-window.dark-mode .neural-field::placeholder {
  color: rgba(245, 241, 235, 0.6);
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 600px) {
  .barbara-chat-container {
    bottom: 15px;
    right: 15px;
  }
  
  .neural-chat-window {
    width: calc(100vw - 30px);
    height: calc(100vh - 120px);
    right: 15px;
    bottom: 85px;
    max-height: calc(100vh - 120px);
  }
  
  .neural-chat-window.maximized,
  .neural-chat-window.fullscreen {
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 0;
    max-height: none;
    transform: none;
  }
  
  .chat-toggle {
    width: 60px;
    height: 60px;
  }
  
  .holographic-ring {
    width: 70px;
    height: 70px;
  }
  
  .neural-core {
    width: 50px;
    height: 50px;
  }
  
  .avatar-container {
    width: 40px;
    height: 40px;
  }
  
  .neural-header {
    padding: 15px 20px;
  }
  
  .neural-title {
    font-size: 14px;
  }
  
  .neural-messages {
    padding: 20px 16px;
    gap: 16px;
  }
  
  .message-core {
    padding: 14px 16px;
  }
  
  .message-text {
    font-size: 13px;
  }
  
  .neural-input-zone {
    padding: 20px 16px;
  }
  
  .neural-field {
    padding: 14px 18px;
    font-size: 13px;
  }
  
  .quantum-transmitter {
    width: 45px;
    height: 45px;
  }
  
  .transmission-icon {
    font-size: 14px;
  }
}

@media (max-width: 400px) {
  .barbara-chat-container {
    bottom: 10px;
    right: 10px;
  }
  
  .neural-chat-window {
    width: calc(100vw - 20px);
    height: calc(100vh - 100px);
    right: 10px;
    bottom: 75px;
    border-radius: 20px 20px 0 0;
    max-height: calc(100vh - 100px);
  }
  
  .neural-chat-window.maximized,
  .neural-chat-window.fullscreen {
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 0;
    max-height: none;
    transform: none;
  }
  
  .chat-toggle {
    width: 55px;
    height: 55px;
  }
  
  .holographic-ring {
    width: 65px;
    height: 65px;
  }
  
  .neural-core {
    width: 45px;
    height: 45px;
  }
  
  .avatar-container {
    width: 35px;
    height: 35px;
  }
}
</style>