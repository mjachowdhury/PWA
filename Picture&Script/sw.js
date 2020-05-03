const staticCacheName = 'app-shell-static-v1';

const staticCacheFileNames = [
    'public/offline.html',
    'lib/app.js'
];

//Caching Static Resources During Install Event (Lines 8–23)
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then((cache) => {
                cache.addAll([
                    '/', //index.htm file will be cached, offline.html and app.js
                    'manifest.json',
                    ...staticCacheFileNames
                ]);
            })
            .catch((error) => {
                console.log(`Error caching static assets: ${error}`);
            })
    );
});

//Update Service Worker And Delete Old Cache (Lines 27–46)
self.addEventListener('activate', (event) => {
    if (self.clients && clients.claim) {
        clients.claim();
    }
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    return cacheName.startsWith('app-shell-') && cacheName !== staticCacheName;
                })
                    .map((cacheName) => {
                        return caches.delete(cacheName);
                    })
            ).catch((error) => {
                console.log(`Some error occurred while removing existing cache: ${error}`);
            });
        }).catch((error) => {
            console.log(`Some error occurred while removing existing cache: ${error}`);
        }));
});

//Cache Then Network Strategy (Lines-49–57)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request)
        }).catch((error) => {
            console.log(`Some error occurred while saving data to dynamic cache: ${error}`);
        })
    );
});

//Caching Static Resources During Install Event (Lines 8–23)
/*The install event of the service worker is the perfect time to specify the file names to be cached. Lines 8–23 of the code help exactly in doing that. The files which get cached are index.html (Line 14’s ‘/’ caches the default HTML file directly), offline.html and app.js. Yes, offline.html does exactly what you think. It was showing the piece of offline content as soon as I switched to offline mode in the demo and that was all coming from the cache.

//Update Service Worker And Delete Old Cache (Lines 27–46)
/*
The activate event of the service worker (lines 25–44) which is the activate event. After the service worker gets installed, the activate event gets fired immediately if no service worker was registered previously. We filter out the cache names accordingly such that it is not the same as the current static cache name which we will be using and delete all our previously cached content that way.
This part is very important if we want to regularly update the client’s browser with the latest cache data and also clean the unnecessary old cache.


//Cache Then Network Strategy (Lines-49–57)
/*This part of the code (lines 46–54) actually helps in first searching the data from the cache. The fetch event of service worker takes place every time an XHR request is fired by the client’s browser.
If the cache contains the response we immediately send it to the client without wasting any time, otherwise, we go to the network to fetch the data.*/