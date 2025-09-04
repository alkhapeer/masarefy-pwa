let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');
const howBtn = document.getElementById('howInstallBtn');

const ua = navigator.userAgent.toLowerCase();
const isIOS = /iphone|ipad|ipod/.test(ua);
const isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;

// افتح نافذة الإرشادات
function openHow(){
  const m = document.getElementById('installHowModal');
  if (!m) return;
  m.style.display = 'block';
  const c = m.querySelector('.close');
  if (c) c.onclick = () => m.style.display = 'none';
}

// لو التطبيق غير مثبت، اعرض زر التثبيت دائمًا
if (installBtn && !isStandalone) installBtn.style.display = 'inline-block';

// Chrome/Edge: نخزّن الحدث ونستخدمه عند الضغط
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.style.display = 'inline-block';
});

// iOS: لا يوجد beforeinstallprompt → اعرض إرشادات
if (isIOS && installBtn){
  installBtn.addEventListener('click', openHow);
} else if (installBtn){
  installBtn.addEventListener('click', async ()=>{
    if (deferredPrompt){
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    } else {
      // في حال لم يصل الحدث (بعض أوضاع المتصفح)، افتح الإرشادات
      openHow();
    }
  });
}

// زر "طريقة التثبيت" دائمًا يفتح الإرشادات
if (howBtn) howBtn.addEventListener('click', openHow);
