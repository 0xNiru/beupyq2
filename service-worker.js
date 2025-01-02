const CACHE_NAME = 'beu-pyqs-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/questions.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/About/index.html',  
  '/About/about.css',  
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});
