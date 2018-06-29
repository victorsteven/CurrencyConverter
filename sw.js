
var staticCacheName = 'currency-static-v2';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            return cache.addAll([
                './.nojekyll',
                './index.html',
                '/js/currency.js'  
            ]);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(function(cacheName){
                    return cacheName.startsWith('currency-') && !staticCacheName.includes(cacheName);
                }).map(function(cacheName){
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
//Use cache to run app
self.addEventListener('fetch', e => {

    e.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
