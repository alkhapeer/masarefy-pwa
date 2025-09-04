// analytics.js — GA4 عبر config.js
(function(){
  const ID = (window.CONFIG && window.CONFIG.GA4_MEASUREMENT_ID) || "";
  if(!ID) { window.track = function(){}; return; }
  // GTM/GA loader
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', ID, { anonymize_ip: true });
  window.track = function(name, params){ try{ gtag('event', name, params || {});}catch(e){} };
})();