const CACHE_NAME = 'temperature-blanket-v1'
const ASSETS_TO_CACHE = ['/', '/client/app.js']

// Install event - cache initial assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Cache assets one by one to identify which ones fail
        return Promise.all(
          ASSETS_TO_CACHE.map((url) => {
            return cache.add(url).catch((error) => {
              console.error(`Failed to cache ${url}:`, error)
              // Continue with other assets even if one fails
              return Promise.resolve()
            })
          })
        )
      })
      .catch((error) => {
        console.error('Cache installation failed:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Get fresh version from network in the background
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        const responseToCache = networkResponse.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })
        return networkResponse
      })

      // Return cached version first, then update from network
      return cachedResponse || fetchPromise
    })
  )
})

// Log any errors
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error)
})
