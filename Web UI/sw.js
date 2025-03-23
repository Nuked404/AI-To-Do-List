// Web UI/sw.js
const CACHE_NAME = "ai-task-manager-v1";

// Install event: Skip waiting to activate immediately
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Activate the new service worker immediately
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // Take control of all clients immediately
});

// Fetch event: Cache all requested resources dynamically
self.addEventListener("fetch", (event) => {
  // Only cache GET requests and avoid caching API calls
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("http://192.168.1.139:8000")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Fetch from network and cache the response
      return fetch(event.request)
        .then((networkResponse) => {
          // Clone the response since it can only be consumed once
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch((error) => {
          console.error("Fetch failed:", error);
          // Optionally return a fallback page (e.g., offline.html) if you create one
        });
    })
  );
});
