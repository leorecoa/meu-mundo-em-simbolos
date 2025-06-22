// Service Worker para melhorar o desempenho offline
const CACHE_NAME = 'mms-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './assets/index.css',
  './assets/index.js',
  './manifest.json',
  './favicon.ico'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Estratégia de cache: Network First, fallback para cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta for válida, clone-a e armazene-a no cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // Se a rede falhar, tente o cache
        return caches.match(event.request);
      })
  );
});