# 🤖 Barbara Nexus - API Documentation

## 📋 Descripción

Barbara Nexus es un chatbot inteligente integrado en AventuraPe que utiliza IA para ayudar a los usuarios con recomendaciones de aventuras, información turística y asistencia general.

## 🔌 Endpoints

### **1. Chat Principal**
**URL:** `https://barbara-nexus.onrender.com/chat`  
**Método:** `POST`  
**Content-Type:** `application/json`

#### **Request Body:**
```json
{
  "message": "¿Qué aventuras recomiendas en Cusco?",
  "user_id": "usuario_123"
}
```

#### **Response:**
```json
{
  "response": "¡Cusco es increíble! Te recomiendo el Camino Inca, la Montaña de 7 Colores y el Valle Sagrado. ¿Te gustaría que te ayude a planificar tu viaje?",
  "status": "success",
  "timestamp": "2025-07-06T02:56:36Z"
}
```

### **2. Health Check**
**URL:** `https://barbara-nexus.onrender.com/health`  
**Método:** `GET`

#### **Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-07-06T02:56:36Z"
}
```

### **3. Interfaz Web**
**URL:** `https://barbara-nexus.onrender.com/chat-web`  
**Método:** `GET`

## 🎯 Casos de Uso

### **Recomendaciones de Aventuras**
```
Usuario: "Quiero hacer trekking en los Andes"
Barbara: "¡Excelente elección! Te recomiendo el Camino Inca a Machu Picchu, 
la Laguna Humantay o el trekking a la Montaña de 7 Colores. 
¿Qué nivel de dificultad prefieres?"
```

### **Información Turística**
```
Usuario: "¿Cuál es la mejor época para visitar Perú?"
Barbara: "La mejor época depende de la región. Para la costa (Lima, Paracas): 
diciembre a abril. Para la sierra (Cusco, Arequipa): mayo a octubre. 
Para la selva: todo el año, pero evita la temporada de lluvias (diciembre a marzo)."
```

### **Ayuda con Actividades**
```
Usuario: "Quiero crear una actividad de kayak en el Lago Titicaca"
Barbara: "¡Genial idea! Para crear una actividad de kayak en el Lago Titicaca, 
necesitarás considerar: equipamiento de seguridad, guías certificados, 
permisos locales y seguros. ¿Te ayudo con los detalles específicos?"
```

## 🔧 Integración en AventuraPe

### **Frontend (Vue.js)**
```javascript
import BarbaraNexusService from '@/shared/services/barbara-nexus.service.js';

// Enviar mensaje
const response = await BarbaraNexusService.sendMessage(
  "¿Qué aventuras recomiendas?", 
  "usuario_123"
);

if (response.success) {
  console.log('Respuesta:', response.data.response);
}
```

### **Backend (Spring Boot)**
```java
@Autowired
private BarbaraNexusService barbaraNexusService;

// Enviar mensaje
Optional<BarbaraResponse> response = 
    barbaraNexusService.sendMessage("Hola", "usuario_123");
```

## 🎨 Características del Chat

### **Diseño Responsivo**
- ✅ Chat flotante en esquina inferior derecha
- ✅ Diseño móvil optimizado
- ✅ Colores y estilos de AventuraPe

### **Funcionalidades**
- ✅ Mensajes en tiempo real
- ✅ Indicador de escritura
- ✅ Notificaciones de mensajes no leídos
- ✅ Historial de conversación
- ✅ Manejo de errores
- ✅ Estados de conexión

### **Estados del Chat**
- 🟢 **En línea:** Servicio funcionando correctamente
- 🟡 **Cargando:** Procesando mensaje
- 🔴 **Error:** Problema de conexión

## 🚀 Instalación y Configuración

### **1. Frontend**
```bash
# El componente ya está integrado en App.vue
# No requiere instalación adicional
```

### **2. Backend**
```properties
# application.properties
barbara.nexus.base-url=https://barbara-nexus.onrender.com
```

### **3. Verificar Instalación**
```bash
# Verificar salud del servicio
curl -X GET https://barbara-nexus.onrender.com/health

# Probar chat
curl -X POST https://barbara-nexus.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola", "user_id": "test"}'
```

## 🔒 Seguridad y Consideraciones

### **Rate Limiting**
- Límite de 50 requests/día en plan gratuito de Gemini AI
- Implementar cache para respuestas frecuentes

### **Datos de Usuario**
- User ID único por sesión
- No se almacenan conversaciones permanentemente
- CORS habilitado para desarrollo

### **Manejo de Errores**
- Timeout de 30 segundos por request
- Reintentos automáticos en caso de fallo
- Mensajes de error amigables para el usuario

## 📱 Uso en Móviles

El chat está completamente optimizado para dispositivos móviles:

- **Tamaño adaptativo:** Se ajusta al ancho de pantalla
- **Touch-friendly:** Botones y elementos táctiles
- **Scroll suave:** Navegación fluida en conversaciones largas
- **Teclado virtual:** Compatible con teclados móviles

## 🎯 Próximas Mejoras

- [ ] Integración con sistema de notificaciones
- [ ] Soporte para imágenes y archivos
- [ ] Chat grupal para actividades
- [ ] Integración con calendario de eventos
- [ ] Análisis de sentimientos de conversaciones
- [ ] Sugerencias automáticas basadas en historial

## 📞 Soporte

Para soporte técnico o reportar problemas:
- **Email:** soporte@aventurape.com
- **Documentación:** [Link a docs]
- **GitHub:** [Link al repositorio]

---

*Barbara Nexus - Tu asistente virtual de aventuras en Perú* 🏔️ 