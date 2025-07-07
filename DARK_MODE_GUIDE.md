# Dark Mode Implementation - AventuraPE

## Resumen de la Implementación

Se ha implementado un sistema completo de dark mode para la aplicación AventuraPE que respeta el requerimiento de **NO afectar las páginas de login y registro**, y que solo esté disponible **después del login en el navbar**.

## Características Principales

### ✅ Toggle de Dark/Light Mode
- **Ubicación**: En el navbar, visible solo después del login
- **Componente**: `ThemeToggle.vue` con animación suave
- **Iconos**: Sol (☀️) para light mode, Luna (🌙) para dark mode

### ✅ Persistencia
- **LocalStorage**: El tema se guarda automáticamente y persiste entre sesiones
- **Inicialización**: Se restaura automáticamente al cargar la aplicación

### ✅ Páginas Protegidas
- **Login/Registro**: NO se ven afectadas por el dark mode
- **Funciona para**: Todas las páginas después del login (adventurer, entrepreneur, admin)

## Archivos Creados/Modificados

### Nuevos Archivos
1. **`src/shared/composables/useTheme.js`** - Composable para manejar el tema
2. **`src/shared/components/ThemeToggle.vue`** - Componente del switch de tema
3. **`src/assets/theme.css`** - Variables y estilos del tema
4. **`src/assets/user-themes.css`** - Estilos específicos para cada tipo de usuario
5. **`src/assets/login-protection.css`** - Protección para páginas de login

### Archivos Modificados
1. **`src/App.vue`** - Inicialización del tema
2. **`src/main.js`** - Importación de estilos y iconos
3. **`src/shared/components/HeaderNav.vue`** - Integración del toggle
4. **`src/assets/base.css`** - Variables de tema actualizadas
5. **`src/assets/main.css`** - Soporte para transiciones

## Estructura del Sistema de Temas

### Variables CSS Principales
```css
/* Light Theme */
:root {
  --theme-bg-primary: #f8f5f0;
  --theme-bg-secondary: #ffffff;
  --theme-bg-card: #ffffff;
  --theme-text-primary: #333333;
  --theme-text-secondary: #666666;
  --theme-border: #e0e0e0;
  --theme-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Dark Theme */
.dark-theme {
  --theme-bg-primary: #1a1a1a;
  --theme-bg-secondary: #2d2d2d;
  --theme-bg-card: #3a3a3a;
  --theme-text-primary: #ffffff;
  --theme-text-secondary: #cccccc;
  --theme-border: #4a4a4a;
  --theme-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

## Componentes Soportados

### ✅ Componentes Nativos
- Tarjetas de actividades
- Formularios y inputs
- Modales y diálogos
- Tablas y listas
- Navegación y menús

### ✅ Componentes PrimeVue
- Cards (`p-card`)
- Buttons (`p-button`)
- InputText (`p-inputtext`)
- Dropdowns (`p-dropdown`)
- Dialogs (`p-dialog`)
- TabMenus (`p-tabmenu`)
- Carousels (`p-carousel`)
- Toast notifications
- Y más...

## Páginas Específicas Cubiertas

### 🏠 Home Pages
- **Adventurer**: `home-adventurer.component.vue`
- **Entrepreneur**: `homeEntrepreneur.vue`
- **Admin**: `homeAdmin.vue`

### 📊 Funcionalidades
- **Estadísticas**: Gráficos y métricas
- **Perfiles**: Tarjetas de usuario
- **Actividades**: Listados y detalles
- **Suscripciones**: Planes y pagos
- **Comentarios**: Sistema de comentarios

## Cómo Usar

### Para Usuarios
1. **Iniciar sesión** en la aplicación
2. **Buscar el toggle** en el navbar (sol/luna)
3. **Hacer clic** para cambiar entre light/dark mode
4. **El tema se guarda automáticamente**

### Para Desarrolladores
```javascript
// Usar el composable en cualquier componente
import { useTheme } from '@/shared/composables/useTheme.js'

export default {
  setup() {
    const { isDarkMode, toggleTheme } = useTheme()
    
    return {
      isDarkMode,
      toggleTheme
    }
  }
}
```

## Personalización

### Agregar Soporte a Nuevos Componentes
```css
.mi-componente {
  background-color: var(--theme-bg-card, #ffffff);
  color: var(--theme-text-primary, #333333);
  border: 1px solid var(--theme-border, #e0e0e0);
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
```

### Variables Disponibles
- `--theme-bg-primary`: Color de fondo principal
- `--theme-bg-secondary`: Color de fondo secundario
- `--theme-bg-card`: Color de fondo para tarjetas
- `--theme-text-primary`: Color de texto principal
- `--theme-text-secondary`: Color de texto secundario
- `--theme-border`: Color de bordes
- `--theme-shadow`: Sombras

## Transiciones Suaves

Todas las transiciones de tema tienen una duración de **0.3 segundos** para una experiencia visual suave:

```css
transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
```

## Compatibilidad

- ✅ **Chrome/Edge**: Totalmente compatible
- ✅ **Firefox**: Totalmente compatible
- ✅ **Safari**: Totalmente compatible
- ✅ **Mobile**: Responsive design incluido

## Notas Técnicas

### Prioridad CSS
Se usan `!important` estratégicamente para asegurar que los temas tengan prioridad sobre estilos existentes.

### Protección de Login
Las páginas de login están específicamente protegidas contra cambios de tema usando selectores CSS específicos.

### Performance
- Uso de variables CSS nativas para mejor rendimiento
- Transiciones optimizadas
- Carga condicional de estilos

## Testing

Para probar el dark mode:

1. **Iniciar la aplicación**: `npm run dev`
2. **Navegar a**: `http://localhost:5174`
3. **Verificar que login NO cambie** con el tema del sistema
4. **Hacer login** con cualquier usuario
5. **Buscar el toggle** en el navbar
6. **Probar el cambio** de tema
7. **Verificar persistencia** recargando la página

## Soporte

Si encuentras algún componente que no respeta el tema dark, simplemente agregar las variables CSS correspondientes al archivo `theme.css` o `user-themes.css`.

---

**Desarrollado por**: Senior Frontend Developer  
**Fecha**: Julio 2025  
**Versión**: 1.0.0
