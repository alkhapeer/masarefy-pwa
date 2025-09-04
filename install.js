// install.js
(function(){
  let deferredPrompt=null; const installBtn=document.getElementById('installBtn'); const howBtn=document.getElementById('howInstallBtn');
  const ua=navigator.userAgent.toLowerCase(); const isIOS=/iphone|ipad|ipod/.test(ua);
  const isStandalone=(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone===true;

  window.addEventListener('beforeinstallprompt',(e)=>{ e.preventDefault(); deferredPrompt=e; if(installBtn) installBtn.style.display='inline-block'; });
  if(isStandalone && installBtn){ installBtn.style.display='none'; }

  function openHow(){ const m=document.getElementById('installHowModal') || document.getElementById('iosModal'); if(m){ m.style.display='block'; const c=m.querySelector('.close'); if(c) c.onclick=()=> m.style.display='none'; } }

  if(isIOS && installBtn){ installBtn.style.display='inline-block'; installBtn.addEventListener('click', openHow); }
  if(howBtn){ howBtn.addEventListener('click', openHow); }

  if(installBtn && !isIOS){
    installBtn.addEventListener('click', async ()=>{ if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; } else { openHow(); } });
  }
})();