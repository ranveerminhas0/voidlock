// VoidLock Service Worker - Client-side only asset precaching for offline support
const CACHE_NAME = "voidlock-v2.3.35";

// Install event - fetch static asset manifest and precache all built assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    fetch("/sw-assets.json")
      .then((response) => response.json())
      .then((data) => {
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.addAll(data.assets).catch(() => {
            return cache.addAll([
              "/",
              "/index.html",
              "/manifest.json",
              "/icon-192.png",
              "/icon-512.png",
            ]);
          });
        });
      })
      .catch(() => {
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.addAll([
            "/",
            "/index.html",
            "/manifest.json",
            "/icon-192.png",
            "/icon-512.png",
          ]);
        });
      })
      .then(() => self.skipWaiting()),
  );
});

// Activate event - take control immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch event - cache-first with automatic caching of all assets
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // Fetch from network and cache
      return fetch(event.request)
        .then((response) => {
          // Only cache valid responses
          if (!response || response.status !== 200) {
            return response;
          }

          // Skip caching for non-same-origin requests
          if (!event.request.url.startsWith(self.location.origin)) {
            return response;
          }

          // Clone response for caching
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Offline fallback - return index.html for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
          return new Response("Offline", { status: 503 });
        });
    }),
  );
});
