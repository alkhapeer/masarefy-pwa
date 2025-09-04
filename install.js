let deferredPrompt=null;
const installBtn=document.getElementById('installBtn');
const howBtn=document.getElementById('howInstallBtn');
const ua=navigator.userAgent.toLowerCase();
const isIOS=/iphone|ipad|ipod/.test(ua);
const isStandalone=(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone===true;
function openHow(){ const m=document.getElementById('installHowModal'); if(!m) return; m.style.display='block'; const c=m.querySelector('.close'); if(c) c.onclick=()=> m.style.display='none'; }
window.addEventListener('beforeinstallprompt',(e)=>{ e.preventDefault(); deferredPrompt=e; if(installBtn) installBtn.style.display='inline-block'; });
if(isStandalone && installBtn){ installBtn.style.display='none'; }
if(isIOS && installBtn){ installBtn.style.display='inline-block'; installBtn.addEventListener('click', openHow); }
if(installBtn && !isIOS){ installBtn.addEventListener('click', async ()=>{ if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; } else { openHow(); } }); }
if(howBtn){ howBtn.addEventListener('click', openHow); }