// Service Worker для PWA
const CACHE_NAME = 'darkweb-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/html/register.html',
  '/html/profile.html',
  '/html/chat.html',
  '/html/marketplace.html',
  '/html/settings.html',
  '/html/sidebar.html',
  '/html/groups.html',
  '/html/personals.html',
  '/html/rules.html',
  '/html/forum.html',
  '/html/news.html',
  '/html/wiki.html',
  '/html/reputation.html',
  '/html/support.html',
  '/html/blacklist.html',
  '/html/trojans.html',
  '/html/email-lists.html',
  '/html/carding.html',
  '/html/spam.html',
  '/html/hacking.html',
  '/html/cracking.html',
  '/html/phreaking.html',
  '/html/viruses.html',
  '/html/anarchy.html',
  '/html/counterfeit.html',
  '/html/forgery.html',
  '/html/laundering.html',
  '/html/assassination.html',
  '/html/conspiracy.html',
  '/css/common.css',
  '/css/index.css',
  '/css/profile.css',
  '/css/register.css',
  '/js/index.js',
  '/js/profile.js',
  '/js/register.js',
  '/js/chat.js',
  '/js/marketplace.js',
  '/js/settings.js',
  '/js/common.js',
  '/js/sidebar.js',
  '/js/loadSidebar.js',
  '/images/planet.png',
  '/images/spider.png',
  '/images/world map.png',
  '/images/web.png',
  '/manifest.json'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем из кеша или делаем сетевой запрос
        return response || fetch(event.request);
      })
  );
});

