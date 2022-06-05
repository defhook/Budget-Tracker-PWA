const APP_PREFIX = "budgettracker-";
const VERSION = "version_01";
const DATA_CACHE_NAME = APP_PREFIX + "data-" + VERSION;
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
  "/",
  "./index.html",
  "./assets/css/styles.css",
  "./assets/js/index.js",
  "./manifest.json",
  "./assets/icons/icon-192x192.png",
  "./assets/icons/icon-512x512.png",
  "./assets/icons/icon-384x384.png",
];

// installing the service worker
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Installing cache: " + CACHE_NAME);
        console.log("cache", cache);
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch((error) => console.log(error))
  );
});

// removing old data from the cache
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});
