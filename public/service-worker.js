const APP_PREFIX = 'budgettracker-';
const VERSION = 'version_01';
const DATA_CACHE_NAME = APP_PREFIX + 'data-' + VERSION;
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