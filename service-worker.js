// Service Worker para PWA - Unión de Pescadores de Plasencia
const CACHE_NAME = 'upp-pesca-v8-admin-equipos';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.webmanifest',
  '/logo.png',
  '/ranking.html',
  '/ranking.js',
  '/ranking-equipos.html',
  '/ranking-equipos.js'
  // Añade aquí más archivos si tienes (imágenes, etc.)
];

// Evento de instalación: cachear todos los archivos necesarios
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cacheando archivos de la app');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] Instalación completa');
        return self.skipWaiting();
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
            // Aquí podrías devolver una página offline personalizada
            return new Response('Sin conexión. Por favor, intenta más tarde.', {
              status: 503,
              statusText: 'Sin conexión',
              headers: new Headers({
                'Content-Type': 'text/plain'
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
