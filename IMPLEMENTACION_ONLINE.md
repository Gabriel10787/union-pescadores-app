# 🔧 Implementación Futura: Sistema Multiusuario en Tiempo Real

## 🌐 Arquitectura para Sincronización en Tiempo Real

### 📦 Stack Tecnológico Recomendado:

#### **Backend:**
```
Node.js + Express.js
Base de datos: PostgreSQL o MySQL
WebSockets: Socket.IO
Autenticación: JWT (JSON Web Tokens)
```

#### **Frontend (modificaciones en la app actual):**
```javascript
// Instalar Socket.IO client
<script src="/socket.io/socket.io.js"></script>

// Conectar al servidor
const socket = io('https://tu-servidor.com');

// Escuchar nuevos pesajes en tiempo real
socket.on('nuevo-pesaje', (datos) => {
  // Actualizar tabla automáticamente
  pintarTabla();
});

// Enviar pesajes al servidor
socket.emit('agregar-pesaje', {
  concursoId: concursoActivoId,
  puesto, nombre, zona, peso
});
```

### 🗄️ Estructura de Base de Datos:

```sql
-- Tabla de concursos
CREATE TABLE concursos (
  id VARCHAR(50) PRIMARY KEY,
  fecha DATE NOT NULL,
  temporada INT NOT NULL,
  nombre VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de zonas
CREATE TABLE zonas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  concurso_id VARCHAR(50),
  nombre VARCHAR(50) NOT NULL,
  FOREIGN KEY (concurso_id) REFERENCES concursos(id)
);

-- Tabla de pesajes
CREATE TABLE pesajes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  concurso_id VARCHAR(50),
  puesto INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  zona VARCHAR(50) NOT NULL,
  peso INT NOT NULL,
  usuario_registro VARCHAR(50),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (concurso_id) REFERENCES concursos(id)
);

-- Tabla de usuarios (opcional, para control de acceso)
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  zona_asignada VARCHAR(50),
  token VARCHAR(255),
  activo BOOLEAN DEFAULT true
);
```

### 🔌 API REST Endpoints:

```javascript
// GET - Obtener concursos
GET /api/concursos
GET /api/concursos/:id
GET /api/concursos/:id/pesajes

// POST - Crear/actualizar
POST /api/concursos
POST /api/pesajes
PUT /api/pesajes/:id
DELETE /api/pesajes/:id

// GET - Ranking en tiempo real
GET /api/ranking/:temporada
```

### 🚀 Ejemplo de Servidor Node.js Básico:

```javascript
const express = require('express');
const socketIO = require('socket.io');
const mysql = require('mysql2/promise');

const app = express();
const server = require('http').Server(app);
const io = socketIO(server);

// Configurar base de datos
const pool = mysql.createPool({
  host: 'localhost',
  user: 'usuario',
  password: 'password',
  database: 'upp_pesca'
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Socket.IO - Tiempo real
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Unirse a sala de concurso
  socket.on('unirse-concurso', (concursoId) => {
    socket.join(`concurso-${concursoId}`);
  });

  // Nuevo pesaje
  socket.on('agregar-pesaje', async (datos) => {
    try {
      const [result] = await pool.execute(
        'INSERT INTO pesajes (concurso_id, puesto, nombre, zona, peso) VALUES (?, ?, ?, ?, ?)',
        [datos.concursoId, datos.puesto, datos.nombre, datos.zona, datos.peso]
      );

      // Notificar a todos en la sala
      io.to(`concurso-${datos.concursoId}`).emit('nuevo-pesaje', {
        id: result.insertId,
        ...datos
      });
    } catch (error) {
      socket.emit('error', error.message);
    }
  });
});

// Rutas API REST
app.get('/api/concursos/:id/pesajes', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM pesajes WHERE concurso_id = ? ORDER BY peso DESC',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pesajes', async (req, res) => {
  const { concursoId, puesto, nombre, zona, peso } = req.body;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO pesajes (concurso_id, puesto, nombre, zona, peso) VALUES (?, ?, ?, ?, ?)',
      [concursoId, puesto, nombre, zona, peso]
    );
    res.json({ id: result.insertId, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
server.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});
```

### 📱 Modificaciones en app.js para Modo Online:

```javascript
// Variable de estado
let modoOnline = false;
let socket = null;

// Inicializar conexión
function conectarServidor() {
  socket = io('https://tu-servidor.com');
  
  socket.on('connect', () => {
    console.log('Conectado al servidor');
    modoOnline = true;
    socket.emit('unirse-concurso', concursoActivoId);
  });

  socket.on('disconnect', () => {
    console.log('Desconectado - modo offline');
    modoOnline = false;
  });

  socket.on('nuevo-pesaje', (datos) => {
    // Actualizar localStorage y tabla
    const concurso = obtenerConcursoActivo();
    if (concurso) {
      concurso.registros.push(datos);
      guardarEnStorage();
      pintarTabla();
    }
  });
}

// Modificar función de guardar pesaje
formPesaje.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const datos = {
    concursoId: concursoActivoId,
    puesto: parseInt(document.getElementById("puesto").value),
    nombre: document.getElementById("nombre").value.trim(),
    zona: document.getElementById("zona").value,
    peso: parseInt(document.getElementById("peso").value)
  };

  if (modoOnline) {
    // Enviar al servidor
    socket.emit('agregar-pesaje', datos);
  } else {
    // Guardar localmente (modo actual)
    const concurso = obtenerConcursoActivo();
    concurso.registros.push({
      id: Date.now(),
      ...datos
    });
    guardarEnStorage();
    pintarTabla();
  }

  formPesaje.reset();
});
```

### 💰 Costes Estimados:

**Opción 1: Hosting compartido**
- VPS pequeño (DigitalOcean, Linode): 5-10€/mes
- Base de datos incluida
- Ideal para <50 usuarios simultáneos

**Opción 2: Hosting gratuito (limitado)**
- Heroku Free Tier: 0€ (limitaciones de uptime)
- MongoDB Atlas Free: 512MB gratis
- Railway Free: 500 horas/mes gratis

**Opción 3: Servidor propio**
- Raspberry Pi + DDNS: ~60€ una vez
- Conexión internet necesaria
- Control total

### 📝 Pasos para Implementación:

1. **Fase 1: Configurar servidor**
   - Contratar hosting
   - Instalar Node.js
   - Configurar base de datos

2. **Fase 2: Desarrollar API**
   - Crear endpoints REST
   - Implementar WebSockets
   - Añadir autenticación básica

3. **Fase 3: Modificar frontend**
   - Añadir Socket.IO client
   - Implementar lógica online/offline
   - Sincronización automática

4. **Fase 4: Testing**
   - Probar con múltiples dispositivos
   - Verificar sincronización
   - Comprobar rendimiento

5. **Fase 5: Despliegue**
   - Publicar servidor
   - Configurar dominio (opcional)
   - Capacitación de usuarios

### ⏱️ Tiempo estimado de desarrollo:
- Backend básico: 2-3 días
- Integración frontend: 1-2 días
- Testing y ajustes: 1 día
- **Total: ~1 semana de desarrollo**

### 🎯 Funcionalidades adicionales posibles:

- ✅ Login de usuarios por zona
- ✅ Chat en tiempo real entre pesadores
- ✅ Notificaciones push de nuevos pesajes
- ✅ Dashboard de administrador
- ✅ Histórico de cambios
- ✅ Detección de duplicados automática
- ✅ Backup automático en la nube
- ✅ Estadísticas en tiempo real

---

## 💡 Conclusión:

La app actual es perfecta para **trabajo offline** y es completamente funcional.

Para **sincronización en tiempo real**, se necesita:
- Inversión en servidor (~60€/año mínimo)
- 1 semana de desarrollo adicional
- Dependencia de conexión a internet

**Recomendación:** Empieza con el modo offline actual y evalúa si realmente necesitas sincronización en tiempo real según tu experiencia de uso.
