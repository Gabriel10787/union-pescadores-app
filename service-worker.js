// Service Worker para PWA - Unión de Pescadores de Plasencia
const CACHE_NAME = 'upp-pesca-v9-corregido';

// Lista de archivos críticos que DEBEN estar cacheados
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.webmanifest',
  '/logo.jpg',
  '/ranking.html',
  '/ranking.js',
  '/ranking-equipos.html',
  '/ranking-equipos.js',
  '/tabs-interface.html',
  '/tabs-script.js',
  '/tabs-styles.css'
];

// Archivos opcionales (no bloquean la instalación si fallan)
const urlsOpcionales = [
  '/README.md',
  '/logo.svg'
];

// Evento de instalación: cachear todos los archivos necesarios
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('[Service Worker] Cacheando archivos críticos...');
        
        try {
          // Intentar cachear archivos críticos
          await cache.addAll(urlsToCache);
          console.log('✅ Archivos críticos cacheados');
        } catch (error) {
          console.error('❌ Error al cachear archivos críticos:', error);
          // Intentar cachear uno por uno para identificar cuál falla
          for (const url of urlsToCache) {
            try {
              await cache.add(url);
              console.log(`✅ Cacheado: ${url}`);
            } catch (err) {
              console.warn(`⚠️ No se pudo cachear: ${url}`, err);
            }
          }
        }
        
        // Cachear archivos opcionales sin bloquear
        for (const url of urlsOpcionales) {
          try {
            await cache.add(url);
            console.log(`✅ Cacheado opcional: ${url}`);
          } catch (err) {
            console.log(`ℹ️ Archivo opcional no disponible: ${url}`);
          }
        }
      })
      .then(() => {
        console.log('[Service Worker] Instalación completa');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Error en instalación:', error);
      })
  );
});

// Evento de activación: limpiar cachés antiguas
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activando...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Eliminando caché antigua:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activación completa');
        return self.clients.claim();
      })
  );
});

// Evento fetch: servir desde caché con fallback a red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si está en caché, devolver desde caché
        if (response) {
          console.log('[Service Worker] Sirviendo desde caché:', event.request.url);
          return response;
        }
        
        // Si no está en caché, intentar obtener de la red
        console.log('[Service Worker] Descargando de la red:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // No cachear si no es una respuesta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar la respuesta para cachear una copia
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('[Service Worker] Error en fetch:', error);
            
            // Si es una página HTML, devolver página offline personalizada
            if (event.request.headers.get('accept').includes('text/html')) {
              return new Response(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Sin Conexión - UPP</title>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      background: linear-gradient(135deg, #021b2d 0%, #033a5a 100%);
                      color: white;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      min-height: 100vh;
                      margin: 0;
                      padding: 20px;
                      text-align: center;
                    }
                    .offline-content {
                      max-width: 400px;
                    }
                    h1 { color: #44c4a1; margin-bottom: 20px; }
                    p { line-height: 1.6; margin-bottom: 20px; }
                    button {
                      background: #44c4a1;
                      color: white;
                      border: none;
                      padding: 12px 24px;
                      border-radius: 8px;
                      font-size: 16px;
                      cursor: pointer;
                      font-weight: bold;
                    }
                    button:hover { background: #36a188; }
                  </style>
                </head>
                <body>
                  <div class="offline-content">
                    <h1>🎣 Sin Conexión</h1>
                    <p>No hay conexión a Internet en este momento.</p>
                    <p>Algunos datos pueden estar disponibles desde el caché.</p>
                    <button onclick="location.reload()">🔄 Reintentar</button>
                  </div>
                </body>
                </html>
              `, {
                status: 503,
                statusText: 'Sin conexión',
                headers: new Headers({
                  'Content-Type': 'text/html; charset=utf-8'
                })
              });
            }
            
            // Para otros tipos de recursos, devolver respuesta de error simple
            return new Response('Sin conexión. Por favor, intenta más tarde.', {
              status: 503,
              statusText: 'Sin conexión',
              headers: new Headers({
                'Content-Type': 'text/plain; charset=utf-8'
              })
            });
          });
      })
  );
});

// Evento de mensaje (para actualizar el service worker si es necesario)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
