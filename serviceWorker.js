var staticCacheName = 'currency-static-v2';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            return cache.addAll([
                './index.html',
                './css/app.css',
                './public/js/currency.min.js',
                'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'
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
// self.addEventListener('fetch', event => {

//     event.respondWith(
//         caches.match(event.request).then(response => {
//             return response || fetch(event.request);
//         })
//     );
// });

self.addEventListener('fetch', event => {
    event.respondWith(
      caches
        .match(event.request)
        .then(response => response || fetch(event.request)),
    );
});