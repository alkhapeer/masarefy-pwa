// service-worker.js
const CACHE_VERSION = "v6-2025-09-04";
const CACHE_NAME = `masarefy-cache-${CACHE_VERSION}`;
const ASSETS = [
  "./","./index.html","./styles.css","./manifest.webmanifest",
  "./config.js","./i18n.js","./utils.js","./storage.js","./tips.js","./charts.js","./app.js","./install.js",
  "./analytics.js","./ads.js",
  "./vendor/chart-loader.js",
  "./assets/icons/icon-192.png","./assets/icons/icon-512.png"
];
self.addEventListener("install",(event)=>{event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));});
self.addEventListener("activate",(event)=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME&&caches.delete(k)))));});
self.addEventListener("fetch",(event)=>{
  const url=new URL(event.request.url);
  const networkOnlyHosts=["googletagmanager.com","google-analytics.com","googlesyndication.com","doubleclick.net","adsterra","propellerads","cdn.jsdelivr.net","cdnjs.cloudflare.com","unpkg.com"];
  if(networkOnlyHosts.some(h=>url.hostname.includes(h))) return;
  event.respondWith(caches.match(event.request).then(res=>res||fetch(event.request).catch(()=>{
    if(event.request.mode==="navigate") return caches.match("./index.html");
    return new Response("",{status:200});
  })));
});