self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    const { title, options } = event.data;
    event.waitUntil(self.registration.showNotification(title, options));
  }
});

// Placeholder for future push notifications
self.addEventListener("push", (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "Images/icon-192.png",
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});
