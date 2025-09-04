// analytics.js with Consent Mode v2
(function(){
  const GAID=(window.APP_CONFIG&&window.APP_CONFIG.GA4_MEASUREMENT_ID)||"";
  const CONSENT_KEY="me_consent"; // 'yes' | 'no'
  // Load gtag
  function loadGA(){ if(!GAID) return;
    const s=document.createElement('script'); s.async=true; s.src=`https://www.googletagmanager.com/gtag/js?id=${GAID}`; s.onerror=()=>{}; document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[]; window.gtag=function(){dataLayer.push(arguments);} ;
    gtag('js', new Date());
    // Initialize consent defaults
    const pref = localStorage.getItem(CONSENT_KEY)||'no';
    applyConsent(pref);
    gtag('config', GAID, { anonymize_ip:true });
  }
  function applyConsent(mode){
    const allow = mode==='yes';
    if(typeof window.gtag==='function'){
      gtag('consent','update',{
        ad_user_data: allow?'granted':'denied',
        ad_personalization: allow?'granted':'denied',
        ad_storage: allow?'granted':'denied',
        analytics_storage: allow?'granted':'denied'
      });
    }
  }
  // Simple banner
  function showConsent(){
    const pref=localStorage.getItem(CONSENT_KEY);
    if(pref==='yes' || pref==='no'){ loadGA(); return; }
    const bar=document.createElement('div'); bar.className='consent-bar';
    bar.innerHTML='<div>نستخدم GA4 وقد نعرض إعلانات. اختر تفضيلك:</div><div style="display:flex;gap:8px"><button class="btn" id="consent-accept">موافق</button><button class="btn danger" id="consent-reject">رفض</button></div>';
    Object.assign(bar.style,{position:'fixed',left:0,right:0,bottom:0,background:'#111c',backdropFilter:'blur(6px)',padding:'10px',zIndex:70,color:'#fff'});
    document.body.appendChild(bar);
    const set=(v)=>{ localStorage.setItem(CONSENT_KEY,v); applyConsent(v); bar.remove(); };
    document.getElementById('consent-accept').onclick=()=>{ set('yes'); loadGA(); };
    document.getElementById('consent-reject').onclick=()=>{ set('no'); loadGA(); };
  }
  window.track=function(name,params={}){ if(typeof window.gtag==='function'&&GAID){ try{ gtag('event',name,params);}catch(e){} } };
  window.addEventListener('DOMContentLoaded', showConsent);
})();