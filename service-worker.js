var CACHE_NAME = "static-cache";

var urlsToCache = [
    "."
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('Activating new service worker...');
    
    var cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            return response || fetchAndCache(event.request);
        })
    );
});

function fetchAndCache(url) {
    return fetch(url)
    .then(function(response) {
        // Check if we received a valid response
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return caches.open(CACHE_NAME)
        .then(function(cache) {
            cache.put(url, response.clone());
            return response;
        });
    })
    .catch(function(error) {
        console.log('Request failed:', error);
        // You could return a custom offline 404 page here
    });
}