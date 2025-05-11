<template>
  <div class="subscription-dashboard">
    <div class="hero-section">
      <h1 class="page-title">Mi membresía</h1>
      <p class="subtitle">Visualiza información sobre tu pago único</p>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p>Cargando información de membresía...</p>
    </div>

    <!-- Dashboard principal -->
    <div v-else class="dashboard-container">
      <!-- Panel izquierdo: Información de membresía -->
      <div class="subscription-info-panel">
        <Card class="subscription-card">
          <template #header>
            <div class="subscription-header">
              <h2>Plan Activo</h2>
            </div>
          </template>
          <template #content>
            <div class="plan-details">
              <h3 class="plan-price">S/ 109.99<span>/único</span></h3>

              <h4>Tus beneficios</h4>
              <ul class="benefits-list">
                <li><i class="pi pi-check"></i> Publica talleres, eventos y experiencias ilimitadas</li>
                <li><i class="pi pi-check"></i> Accede a una comunidad activa de aventureros</li>
                <li><i class="pi pi-check"></i> Promociona tu negocio y aumenta tu visibilidad</li>
              </ul>

              <h4>Información importante</h4>
              <ul class="info-list">
                <li><i class="pi pi-info-circle"></i> Una vez verificado el pago, tu acceso no tiene fecha de caducidad</li>
                <li><i class="pi pi-wallet"></i> El pago único te da acceso permanente a la plataforma</li>
              </ul>
            </div>
          </template>
        </Card>

        <!-- Panel de preguntas frecuentes -->
      </div>

      <!-- Panel derecho: Comprobante de pago -->
      <div class="payment-proof-panel">
        <Card class="proof-card">
          <template #header>
            <div class="proof-header">
              <h2>Comprobante de Pago</h2>
              <span v-if="proofingEntrepreneure" class="status-badge proof-badge">Verificado</span>
            </div>
          </template>
          <template #content>
            <!-- Cuando hay comprobante -->
            <div v-if="proofingEntrepreneure" class="proof-content">
              <img :src="getImageUrl(proofingEntrepreneure)" alt="Comprobante de Pago" class="proof-image" />
              <div class="proof-details">
                <p><i class="pi pi-check-circle"></i> Comprobante recibido correctamente</p>
                <p><i class="pi pi-calendar"></i> Verificado: {{ currentDate }}</p>
                <p><i class="pi pi-info-circle"></i> Tu membresía está activa</p>
              </div>

              <button class="update-button" @click="showUploadDialog = true">
                <i class="pi pi-upload"></i>
                Actualizar comprobante
              </button>
            </div>

            <!-- Cuando no hay comprobante -->
            <div v-else class="upload-content">
              <div class="upload-message">
                <i class="pi pi-exclamation-circle warning-icon"></i>
                <p class="marketing-message">Necesitamos verificar tu pago</p>
                <p class="instruction-message">Por favor, sube una imagen clara de tu comprobante de pago para activar completamente tu membresía.</p>
              </div>

              <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="onFileDrop">
                <input
                    type="file"
                    ref="fileInput"
                    style="display:none"
                    accept="image/*"
                    @change="handleFileUpload"
                />
                <i class="pi pi-cloud-upload upload-icon"></i>
                <p>Haz clic aquí para subir tu comprobante</p>
                <p class="upload-subtitle">o arrastra y suelta la imagen aquí</p>
              </div>

              <div v-if="selectedFile" class="selected-file">
                <p><i class="pi pi-file"></i> {{ selectedFile.name }}</p>
              </div>

              <button
                  class="upload-button"
                  :disabled="!selectedFile"
                  @click="uploadComprobante"
              >
                <i class="pi pi-check"></i>
                Enviar comprobante
              </button>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Diálogo para actualizar comprobante -->
    <Dialog
        v-model:visible="showUploadDialog"
        header="Actualizar comprobante"
        :style="{width: '650px'}"
        :modal="true"
        :closable="true"
        class="update-dialog"
    >
      <div class="upload-dialog-content">
        <div class="upload-message">
          <i class="pi pi-sync warning-icon"></i>
          <p class="marketing-message">Actualiza tu comprobante de pago</p>
          <p class="instruction-message">Selecciona una nueva imagen para reemplazar tu comprobante actual.</p>
        </div>

        <div class="upload-area dialog-upload-area" @click="triggerDialogFileInput" @dragover.prevent @drop.prevent="onDialogFileDrop">
          <input
              type="file"
              ref="dialogFileInput"
              style="display:none"
              accept="image/*"
              @change="handleDialogFileUpload"
          />
          <i class="pi pi-cloud-upload upload-icon"></i>
          <p>Haz clic aquí para seleccionar un archivo</p>
          <p class="upload-subtitle">o arrastra y suelta la imagen aquí</p>
        </div>

        <div v-if="dialogSelectedFile" class="selected-file">
          <p><i class="pi pi-file"></i> {{ dialogSelectedFile.name }}</p>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <button class="dialog-cancel-btn" @click="showUploadDialog = false">
            <i class="pi pi-times"></i> Cancelar
          </button>
          <button
              class="dialog-update-btn"
              :disabled="!dialogSelectedFile"
              @click="updateComprobante"
          >
            <i class="pi pi-check"></i> Actualizar
          </button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import apiProofingEntrepreneure from '@/domains/subscriptionManagement/entrepreneur/services/apiProofingEntrepreneure.js';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';

export default {
  name: "SubscriptionDashboard",
  components: {
    Card,
    Dialog
  },
  data() {
    return {
      proofingEntrepreneure: null,
      loading: true,
      selectedFile: null,
      dialogSelectedFile: null,
      showUploadDialog: false,
      currentDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      faqs: [
        {
          question: '¿Puedo cancelar mi suscripción en cualquier momento?',
          answer: 'Sí, puedes cancelar tu suscripción cuando lo desees. Solo necesitas notificarnos con 15 días de anticipación antes de tu próximo ciclo de facturación.',
          open: false
        },
        {
          question: '¿Qué métodos de pago aceptan?',
          answer: 'Actualmente trabajamos con transferencias bancarias y depósitos. Una vez que te suscribas, te enviaremos los datos bancarios para realizar el pago mensual.',
          open: false
        },
        {
          question: '¿Cómo puedo contactar a soporte?',
          answer: 'Para cualquier duda sobre el proceso, puedes contactarnos en soporte@tudominio.com o a través del chat en línea disponible en nuestra plataforma.',
          open: false
        }
      ]
    };
  },
  async created() {
    try {
      const userId = this.getUserId();
      const response = await apiProofingEntrepreneure.get(`/users/${userId}`);

      console.log("Respuesta completa del backend:", response.data);

      // Establecemos el comprobante
      this.proofingEntrepreneure = response.data.proofingEntrepreneure || null;
      console.log("Comprobante recibido:", this.proofingEntrepreneure ? "Sí (longitud: " + this.proofingEntrepreneure.length + ")" : "No");

    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      this.proofingEntrepreneure = null;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    toggleFaq(index) {
      this.faqs[index].open = !this.faqs[index].open;
    },
    getUserId() {
      const userId = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userId="))
          ?.split("=")[1];
      return userId || '1';
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    triggerDialogFileInput() {
      this.$refs.dialogFileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.size <= 5000000) { // Limitar a 5MB
        this.selectedFile = file;
      } else if (file) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
      }
    },
    handleDialogFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.size <= 5000000) { // Limitar a 5MB
        this.dialogSelectedFile = file;
      } else if (file) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
      }
    },
    onFileDrop(event) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith('image/')) {
        if (files[0].size <= 5000000) { // Limitar a 5MB
          this.selectedFile = files[0];
        } else {
          alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
        }
      }
    },
    onDialogFileDrop(event) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith('image/')) {
        if (files[0].size <= 5000000) { // Limitar a 5MB
          this.dialogSelectedFile = files[0];
        } else {
          alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
        }
      }
    },
    // Método para convertir la imagen a base64
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    // Método para asegurar que la imagen se muestra correctamente
    getImageUrl(base64String) {
      if (!base64String) return '';

      // Verificar si ya tiene el prefijo data:image
      if (base64String.startsWith('data:image')) {
        return base64String;
      }

      // Intentar determinar el tipo de imagen o usar un tipo genérico
      return `data:image/jpeg;base64,${base64String}`;
    },
    async uploadComprobante() {
      if (!this.selectedFile) return;

      this.loading = true;

      try {
        const userId = this.getUserId();

        // Convertir imagen a base64
        const base64Image = await this.fileToBase64(this.selectedFile);

        // Extraer solo la parte de datos del base64 (quitando el prefijo data:image/xxx;base64,)
        const base64Data = base64Image.split(',')[1];

        console.log("Subiendo comprobante para el usuario:", userId);
        console.log("Longitud del comprobante en base64:", base64Data.length);

        // Llamar al método del servicio para actualizar el comprobante
        await apiProofingEntrepreneure.updateProofingEntrepreneure(userId, base64Data);
        console.log("Comprobante subido exitosamente");

        // Actualizar el componente con la nueva imagen
        this.proofingEntrepreneure = base64Data;
        this.selectedFile = null;

      } catch (error) {
        console.error("Error al subir el comprobante:", error);
        if (error.response) {
          console.error("Detalles del error:", error.response.data);
          console.error("Estado HTTP:", error.response.status);
        }
        alert("Hubo un error al subir el comprobante. Por favor, inténtalo de nuevo.");
      } finally {
        this.loading = false;
      }
    },
    async updateComprobante() {
      if (!this.dialogSelectedFile) return;

      this.loading = true;
      this.showUploadDialog = false;

      try {
        const userId = this.getUserId();
        const base64Image = await this.fileToBase64(this.dialogSelectedFile);
        const base64Data = base64Image.split(',')[1];

        await apiProofingEntrepreneure.updateProofingEntrepreneure(userId, base64Data);

        // Actualizar la imagen mostrada
        this.proofingEntrepreneure = base64Data;
        this.dialogSelectedFile = null;

      } catch (error) {
        console.error("Error al actualizar el comprobante:", error);
        alert("Hubo un error al actualizar el comprobante. Por favor, inténtalo de nuevo.");
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>

.subscription-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.hero-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background-color: var(--primary-lighter);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.page-title {
  color: var(--primary-color);
  margin-bottom: 10px;
  font-size: 32px;
  font-weight: 700;
}

.subtitle {
  color: var(--text-light);
  font-size: 18px;
}
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #765532;
}

.dashboard-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

/* Panel de información de suscripción */
.subscription-info-panel {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.subscription-card, .proof-card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  overflow: hidden;
  background-color: #FFFFFF;
  border: none;
}

:deep(.p-card-body), :deep(.p-card-content) {
  padding: 0;
}

.subscription-header, .proof-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f8f9fa;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.subscription-header h2, .proof-header h2 {
  margin: 0;
  color: #765532;
  font-size: 18px;
  font-weight: 600;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.proof-badge {
  background-color: #3a7539;
  color: white;
}

.plan-details {
  padding: 24px;
}

.plan-price {
  font-size: 38px;
  color: #765532;
  margin: 0 0 5px 0;
  font-weight: 700;
}

.plan-price span {
  font-size: 16px;
  color: #888;
  font-weight: 400;
}

.next-payment {
  color: #666;
  margin-bottom: 24px;
  font-size: 14px;
}

h4 {
  color: #765532;
  font-size: 16px;
  margin: 20px 0 12px;
  font-weight: 600;
}

.benefits-list, .info-list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
}

.benefits-list li, .info-list li {
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  color: #555;
  font-size: 14px;
  line-height: 1.5;
}

.benefits-list i, .info-list i {
  color: #A88662;
  margin-right: 10px;
  margin-top: 3px;
  font-size: 14px;
}

/* FAQs section */
.faq-section {
  margin-top: 10px;
}

.faq-title {
  color: #765532;
  font-size: 18px;
  margin: 0 0 16px 0;
  font-weight: 600;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 10px;
}

.faq-item {
  margin-bottom: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
  color: #765532;
}

.faq-question:hover {
  background-color: #f2f2f2;
}

.faq-question i {
  color: #A88662;
}

.faq-answer {
  padding: 16px;
  background-color: white;
  color: #555;
  font-size: 14px;
  border-top: 1px solid #f0f0f0;
  line-height: 1.6;
}

.faq-answer p {
  margin: 0;
  line-height: 1.5;
}

/* Panel de comprobante */
.proof-content {
  padding: 24px;
}

.proof-image {
  width: 100%;
  height: 280px;
  object-fit: contain;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.proof-details p {
  display: flex;
  align-items: center;
  margin: 10px 0;
  font-size: 14px;
  color: #555;
}

.proof-details i {
  margin-right: 10px;
  font-size: 16px;
  color: #A88662;
}

.update-button {
  background: transparent;
  color: #A88662;
  border: 1px solid #A88662;
  border-radius: 25px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  margin-left: auto;
}

.update-button:hover {
  background-color: rgba(168, 134, 98, 0.1);
}

/* Sección de upload */
.upload-content {
  padding: 24px;
}

.upload-message {
  text-align: center;
  margin-bottom: 30px;
}

.warning-icon {
  font-size: 36px;
  color: #f59e0b;
  margin-bottom: 15px;
}

.marketing-message {
  font-size: 18px;
  font-weight: 600;
  color: #765532;
  margin-bottom: 10px;
}

.instruction-message {
  color: #666;
  font-size: 14px;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.5;
}

.upload-area, .dialog-upload-area {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 30px 20px;
  text-align: center;
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover, .dialog-upload-area:hover {
  border-color: #A88662;
  background-color: rgba(168, 134, 98, 0.03);
}

.upload-icon {
  font-size: 32px;
  color: #A88662;
  margin-bottom: 12px;
}

.upload-subtitle {
  color: #999;
  font-size: 13px;
  margin-top: 5px;
}

.selected-file {
  margin: 15px auto;
  padding: 10px 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
  font-size: 14px;
}

.selected-file i {
  margin-right: 10px;
  color: #A88662;
}

.upload-button {
  background-color: #A88662;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px auto 0;
}

.upload-button:hover:not(:disabled) {
  background-color: #765532;
  transform: translateY(-2px);
}

.upload-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Estilos de dialog mejorados */
:deep(.update-dialog) .p-dialog-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 20px;
}

:deep(.update-dialog) .p-dialog-title {
  color: #765532;
  font-size: 18px;
  font-weight: 600;
}

:deep(.update-dialog) .p-dialog-content {
  padding: 24px;
}

.upload-dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-cancel-btn, .dialog-update-btn {
  padding: 10px 18px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.dialog-cancel-btn {
  background: transparent;
  border: 1px solid #ccc;
  color: #666;
}

.dialog-cancel-btn:hover {
  background-color: #f8f8f8;
  border-color: #aaa;
}

.dialog-update-btn {
  background-color: #A88662;
  border: none;
  color: white;
}

.dialog-update-btn:hover:not(:disabled) {
  background-color: #765532;
  transform: translateY(-2px);
}

.dialog-update-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Responsive styles */
@media (max-width: 992px) {
  .dashboard-container {
    grid-template-columns: 1fr;
  }

  .subscription-info-panel, .payment-proof-panel {
    margin-bottom: 30px;
  }
}

@media (max-width: 576px) {
  .dashboard-title {
    font-size: 24px;
  }

  .proof-image {
    height: 200px;
  }

  .subscription-header h2, .proof-header h2, .faq-title {
    font-size: 16px;
  }

  .plan-price {
    font-size: 32px;
  }

  .plan-details, .proof-content, .upload-content {
    padding: 16px;
  }

  :deep(.update-dialog) {
    width: 95% !important;
  }


}
</style>