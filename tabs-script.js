// Sistema de gestión de pestañas
class TabManager {
  constructor() {
    this.tabs = [];
    this.activeTabId = null;
    this.tabIdCounter = 0;
    
    this.tabsContainer = document.getElementById('tabs-container');
    this.contentArea = document.getElementById('content-area');
    this.newTabBtn = document.getElementById('new-tab-btn');
    
    this.init();
  }

  init() {
    // Crear pestañas iniciales
    this.createTab('Inicio', '🏠', this.getHomeContent());
    this.createTab('Documentos', '📄', this.getDocumentsContent());
    this.createTab('Configuración', '⚙️', this.getSettingsContent());
    
    // Event listener para nueva pestaña
    this.newTabBtn.addEventListener('click', () => this.createNewTab());
    
    // Activar la primera pestaña
    if (this.tabs.length > 0) {
      this.activateTab(this.tabs[0].id);
    }
  }

  createTab(title, icon, content) {
    const tabId = `tab-${this.tabIdCounter++}`;
    
    const tab = {
      id: tabId,
      title: title,
      icon: icon,
      content: content
    };
    
    this.tabs.push(tab);
    this.renderTab(tab);
    this.renderContent(tab);
    
    return tabId;
  }

  renderTab(tab) {
    const tabElement = document.createElement('div');
    tabElement.className = 'tab';
    tabElement.dataset.tabId = tab.id;
    
    tabElement.innerHTML = `
      <div class="tab-icon">${tab.icon}</div>
      <div class="tab-title">${tab.title}</div>
      <button class="tab-close" title="Cerrar pestaña">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
        </svg>
      </button>
    `;
    
    // Event listener para activar pestaña
    tabElement.addEventListener('click', (e) => {
      if (!e.target.closest('.tab-close')) {
        this.activateTab(tab.id);
      }
    });
    
    // Event listener para cerrar pestaña
    const closeBtn = tabElement.querySelector('.tab-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeTab(tab.id);
    });
    
    this.tabsContainer.appendChild(tabElement);
  }

  renderContent(tab) {
    const contentElement = document.createElement('div');
    contentElement.className = 'tab-content';
    contentElement.dataset.tabId = tab.id;
    contentElement.innerHTML = tab.content;
    
    this.contentArea.appendChild(contentElement);
  }

  activateTab(tabId) {
    // Desactivar todas las pestañas
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    
    // Activar la pestaña seleccionada
    const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`);
    if (tabElement && tabElement.classList.contains('tab')) {
      tabElement.classList.add('active');
      
      // Scroll para hacer visible la pestaña activa
      tabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    
    const contentElement = this.contentArea.querySelector(`[data-tab-id="${tabId}"]`);
    if (contentElement) {
      contentElement.classList.add('active');
    }
    
    this.activeTabId = tabId;
  }

  closeTab(tabId) {
    const tabIndex = this.tabs.findIndex(t => t.id === tabId);
    
    if (tabIndex === -1) return;
    
    // No permitir cerrar si es la última pestaña
    if (this.tabs.length === 1) {
      alert('No puedes cerrar la última pestaña');
      return;
    }
    
    // Eliminar elementos del DOM
    const tabElement = document.querySelector(`.tab[data-tab-id="${tabId}"]`);
    const contentElement = document.querySelector(`.tab-content[data-tab-id="${tabId}"]`);
    
    if (tabElement) tabElement.remove();
    if (contentElement) contentElement.remove();
    
    // Eliminar del array
    this.tabs.splice(tabIndex, 1);
    
    // Si la pestaña cerrada era la activa, activar otra
    if (this.activeTabId === tabId) {
      const newActiveIndex = Math.max(0, tabIndex - 1);
      if (this.tabs[newActiveIndex]) {
        this.activateTab(this.tabs[newActiveIndex].id);
      }
    }
  }

  createNewTab() {
    const tabNumber = this.tabs.length + 1;
    const newTabId = this.createTab(
      `Nueva pestaña ${tabNumber}`,
      '🌐',
      this.getNewTabContent(tabNumber)
    );
    
    this.activateTab(newTabId);
  }

  // Contenidos de ejemplo
  getHomeContent() {
    return `
      <div class="content-wrapper">
        <h1>🏠 Bienvenido a la Interfaz de Pestañas</h1>
        <p>Esta es una demostración de un sistema de pestañas apiladas con diseño moderno.</p>
        
        <div class="content-card">
          <h2>Características principales</h2>
          <p>✓ Pestañas apiladas con efecto de profundidad</p>
          <p>✓ Transiciones suaves y animaciones</p>
          <p>✓ Iconos identificativos para cada pestaña</p>
          <p>✓ Botones para cerrar pestañas individuales</p>
          <p>✓ Botón para agregar nuevas pestañas</p>
          <p>✓ Diseño responsive y moderno</p>
        </div>
        
        <div class="content-card">
          <h2>Cómo usar</h2>
          <p><strong>Cambiar de pestaña:</strong> Haz clic en cualquier pestaña de la barra superior</p>
          <p><strong>Cerrar pestaña:</strong> Haz clic en el botón ✕ de la pestaña (aparece al pasar el cursor)</p>
          <p><strong>Nueva pestaña:</strong> Haz clic en el botón + en la esquina superior derecha</p>
        </div>

        <div class="content-card">
          <h2>Tecnologías utilizadas</h2>
          <p>HTML5, CSS3 (con variables CSS y animaciones), JavaScript ES6+ con programación orientada a objetos</p>
        </div>
      </div>
    `;
  }

  getDocumentsContent() {
    return `
      <div class="content-wrapper">
        <h1>📄 Documentos</h1>
        <p>Gestiona tus documentos y archivos desde esta sección.</p>
        
        <div class="content-card">
          <h2>Documentos recientes</h2>
          <p>📝 Informe_Q1_2026.pdf - Modificado hace 2 horas</p>
          <p>📊 Presentación_Ventas.pptx - Modificado ayer</p>
          <p>📈 Análisis_Mercado.xlsx - Modificado hace 3 días</p>
        </div>
        
        <div class="content-card">
          <h2>Carpetas</h2>
          <p>📁 Proyectos activos</p>
          <p>📁 Archivo histórico</p>
          <p>📁 Plantillas</p>
        </div>
      </div>
    `;
  }

  getSettingsContent() {
    return `
      <div class="content-wrapper">
        <h1>⚙️ Configuración</h1>
        <p>Personaliza tu experiencia con estas opciones.</p>
        
        <div class="content-card">
          <h2>Apariencia</h2>
          <p>🎨 Tema: Claro</p>
          <p>🔤 Tamaño de fuente: Medio</p>
          <p>🌈 Color de acento: Azul</p>
        </div>
        
        <div class="content-card">
          <h2>General</h2>
          <p>🌐 Idioma: Español</p>
          <p>📍 Zona horaria: GMT+1</p>
          <p>🔔 Notificaciones: Activadas</p>
        </div>

        <div class="content-card">
          <h2>Privacidad y seguridad</h2>
          <p>🔒 Autenticación en dos pasos: Activada</p>
          <p>👁️ Modo privado: Desactivado</p>
          <p>🗑️ Borrar datos al cerrar: No</p>
        </div>
      </div>
    `;
  }

  getNewTabContent(number) {
    return `
      <div class="content-wrapper">
        <h1>🌐 Nueva pestaña ${number}</h1>
        <p>Esta es una nueva pestaña que acabas de crear.</p>
        
        <div class="content-card">
          <h2>Contenido personalizable</h2>
          <p>Puedes agregar cualquier contenido aquí: texto, imágenes, formularios, tablas, gráficos, etc.</p>
          <p>El sistema de pestañas es completamente dinámico y puedes integrarlo con cualquier contenido HTML.</p>
        </div>
        
        <div class="content-card">
          <h2>Ideas de uso</h2>
          <p>📊 Dashboards con diferentes vistas de datos</p>
          <p>📝 Editor de documentos con múltiples archivos abiertos</p>
          <p>🛒 Tienda online con diferentes categorías</p>
          <p>📧 Cliente de correo con carpetas</p>
          <p>📱 Aplicación de administración con módulos</p>
        </div>
      </div>
    `;
  }
}

// Inicializar el gestor de pestañas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new TabManager();
});
