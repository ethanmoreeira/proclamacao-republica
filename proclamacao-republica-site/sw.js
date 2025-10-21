// Service Worker para cache offline
const CACHE_NAME = 'proclamacao-republica-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/historia.html',
    '/personagens.html',
    '/documentos.html',
    '/galeria.html',
    '/quiz.html',
    '/contato.html',
    '/fontes.html',
    '/css/style.css',
    '/js/main.js',
    '/js/timeline.js',
    '/js/quiz.js',
    '/js/gallery.js',
    '/js/contact.js'
];

// Instalar Service Worker
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Buscar recursos
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - retornar resposta
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});

// Atualizar Service Worker
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});