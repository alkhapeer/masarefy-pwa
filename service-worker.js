// service-worker.js
const CACHE_VERSION = "v1.0.7-1756985052";
const CACHE_NAME = `masarefy-cache-${CACHE_VERSION}`;
const ASSETS = ["./","./index.html","./manifest.webmanifest","./assets/icons/icon-192.png","./assets/icons/icon-512.png"];
self.addEventListener("install",(event)=>{
  event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
});
self.addEventListener("activate",(event)=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME&&caches.delete(k)))));
});
self.addEventListener("fetch",(event)=>{
  const url = new URL(event.request.url);
  event.respondWith(
    caches.match(event.request).then(res=>res||fetch(event.request).catch(()=>{
      if(event.request.mode==="navigate") return caches.match("./index.html");
      return new Response("",{status:200});
    }))
  );
});
