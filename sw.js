// Service Worker для PWA
const CACHE_NAME = 'darkweb-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/html/register.html',
  '/html/profile.html',
  '/html/chat.html',
  '/html/marketplace.html',
  '/html/settings.html',
  '/html/dashboard.html',
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
  '/css/dashboard.css',
  '/css/chat-enhanced.css',
  '/css/marketplace-enhanced.css',
  '/css/friends.css',
  '/css/private-messages.css',
  '/css/page-transitions.css',
  '/css/animations.css',
  '/css/achievements.css',
  '/css/notifications.css',
  '/css/themes.css',
  '/css/search.css',
  '/js/index.js',
  '/js/profile.js',
  '/js/register.js',
  '/js/chat.js',
  '/js/chat-enhanced.js',
  '/js/chat-sounds.js',
  '/js/marketplace.js',
  '/js/marketplace-enhanced.js',
  '/js/settings.js',
  '/js/dashboard.js',
  '/js/common.js',
  '/js/sidebar.js',
  '/js/loadSidebar.js',
  '/js/friends.js',
  '/js/private-messages.js',
  '/js/page-transitions.js',
  '/js/error-handler.js',
  '/js/search.js',
  '/js/animations.js',
  '/js/achievements.js',
  '/js/notifications.js',
  '/js/themes.js',
  '/js/init.js',
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
        if (response) {
          return response;
        }
        
        // Для сетевых запросов используем стратегию "Network First"
        return fetch(event.request)
          .then((response) => {
            // Проверяем валидность ответа
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Клонируем ответ для кеширования
            const responseToCache = response.clone();
            
            // Кешируем только GET запросы
            if (event.request.method === 'GET') {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            
            return response;
          })
          .catch(() => {
            // Если сеть недоступна, пытаемся вернуть fallback
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Push уведомления
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление',
    icon: '/images/spider.png',
    badge: '/images/spider.png',
    vibrate: [200, 100, 200],
    tag: 'darkweb-notification',
    requireInteraction: true
  };
  
  event.waitUntil(
    self.registration.showNotification('DARKWEB', options)
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

