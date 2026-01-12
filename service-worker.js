self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("bloom-heaven-cache").then((cache) => {
      return cache.addAll(["/", "/style.css", "/script.js"]);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
