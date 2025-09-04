// ads.js
(function(){
  function safeLoadScript(src, attrs={}){ if(!src) return; const s=document.createElement('script'); s.async=true; s.src=src; Object.entries(attrs).forEach(([k,v])=> s.setAttribute(k,v)); s.onerror=()=>{}; document.head.appendChild(s); }
  async function init(){
    const cfgUrl='ads-config.json';
    let cfg=null; try{ const r=await fetch(cfgUrl,{cache:'no-cache'}); if(r.ok) cfg=await r.json(); }catch(e){}
    const provider=(cfg?.provider || (window.APP_CONFIG?.ADS_PROVIDER||'none')).toLowerCase();
    const top=document.getElementById('ad-top'); const bottom=document.getElementById('ad-bottom');
    const topEnabled=cfg?.banners?.top?.enabled ?? true; const bottomEnabled=cfg?.banners?.bottom?.enabled ?? true;
    if(top) top.style.display= topEnabled?'block':'none'; if(bottom) bottom.style.display= bottomEnabled?'block':'none';
    if(provider==='adsense'){
      const client=cfg?.adsense?.client || window.APP_CONFIG?.ADSENSE_CLIENT_ID || '';
      const slotTop=cfg?.adsense?.slot_top || window.APP_CONFIG?.ADSENSE_SLOT_BANNER_TOP || '';
      const slotBottom=cfg?.adsense?.slot_bottom || window.APP_CONFIG?.ADSENSE_SLOT_BANNER_BOTTOM || '';
      if(client && !document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')){
        safeLoadScript(`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`, {'crossorigin':'anonymous'});
      }
      function unit(container, slot){ if(!client||!slot||!container) return; const ins=document.createElement('ins'); ins.className='adsbygoogle'; ins.style.display='block'; ins.setAttribute('data-ad-client', client); ins.setAttribute('data-ad-slot', slot); ins.setAttribute('data-ad-format','auto'); ins.setAttribute('data-full-width-responsive','true'); container.innerHTML=''; container.appendChild(ins); const s=document.createElement('script'); s.text='(adsbygoogle=window.adsbygoogle||[]).push({});'; container.appendChild(s); }
      if(topEnabled) unit(top,slotTop); if(bottomEnabled) unit(bottom,slotBottom);
    } else if(provider==='propeller'){ if(top) top.innerHTML='<div class="ad-placeholder">PropellerAds</div>'; if(bottom) bottom.innerHTML='<div class="ad-placeholder">PropellerAds</div>'; }
      else if(provider==='adsterra'){ if(top) top.innerHTML='<div class="ad-placeholder">Adsterra</div>'; if(bottom) bottom.innerHTML='<div class="ad-placeholder">Adsterra</div>'; }
    try{ const io=new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting && typeof window.track==='function'){ window.track('ad_impression',{placement:e.target.id==='ad-top'?'top':'bottom', provider}); } }); }); if(top) io.observe(top); if(bottom) io.observe(bottom);}catch(e){}
  }
  window.addEventListener('DOMContentLoaded', init);
})();