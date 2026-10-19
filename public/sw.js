// Service Worker for Midnight Nursery Offline Support
const CACHE_NAME = 'midnight-nursery-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pip_avatar_cloud.png',
  '/pip_portrait.png',
  '/pip_lullaby_box.png',
  '/pip_dream_lantern.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(e.request).catch(() => caches.match('/index.html'))
      );
    })
  );
});
