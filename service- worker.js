const CACHE_NAME = "beatx-player-v1";

const FILES_TO_CACHE = [
  "index.html",
  "script.css",
  "script.js",
  "manifest.json",
  "icon-192.png",
  "icon-512.png"
];

// Install SW
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching files...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
