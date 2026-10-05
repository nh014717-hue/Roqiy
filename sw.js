/* Service Worker - عاداتي اليومية
   غيّر رقم VERSION كل ما تعدّل في الملفات عشان المستخدمين ياخدوا النسخة الجديدة */
const VERSION = 'v6';
const SHELL_CACHE = 'habits-shell-' + VERSION;
const RUNTIME_CACHE = 'habits-runtime-' + VERSION;

const SHELL_FILES = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './ideas.css',
  './ideas.js',
  './manifest.json',
  './cloud-sync.js',
  './firebase-config.js',
  './icon-192.png',
  './icon-512.png'
];

// مصادر خارجية بتتخزن تلقائيًا بعد أول استخدام (خطوط، مكتبة QR، بيانات الأذكار)
const CACHEABLE_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com',
  'raw.githubusercontent.com',
  'www.gstatic.com'          // مكتبات Firebase
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    // كل ملف بيتخزن لوحده: لو ملف واحد فشل، التثبيت ما يفشلش كله
    caches.open(SHELL_CACHE)
      .then((cache) => Promise.allSettled(SHELL_FILES.map((f) => cache.add(f))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // صفحات تسجيل الدخول الخاصة بـ Firebase: مش بنتدخل أبدًا
  if (url.pathname.startsWith('/__/')) return;

  // الصوتيات: مش بنتدخل (ملفات كبيرة وبتحتاج Range requests)
  if (req.destination === 'audio' || req.destination === 'video' || req.headers.has('range')) return;

  // مواقيت الصلاة (API): الإنترنت أولًا، ولو مفيش نت نرجع آخر نسخة محفوظة
  if (url.hostname === 'api.aladhan.com') {
    event.respondWith(networkFirst(req));
    return;
  }

  // صفحة البرنامج نفسها
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const isApp = url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
          if (res.ok && isApp) {
            const copy = res.clone();
            caches.open(SHELL_CACHE).then((c) => c.put('./index.html', copy));
          }
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // ملفات البرنامج (نفس الدومين): من الكاش أولًا مع تحديث في الخلفية
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(req, SHELL_CACHE));
    return;
  }

  // مصادر خارجية معروفة
  if (CACHEABLE_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
  }
});

function staleWhileRevalidate(req, cacheName) {
  return caches.open(cacheName).then((cache) =>
    cache.match(req).then((cached) => {
      const fetching = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || fetching;
    })
  );
}

function networkFirst(req) {
  return fetch(req)
    .then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
      }
      return res;
    })
    .catch(() => caches.match(req).then((hit) => hit || Response.error()));
}
