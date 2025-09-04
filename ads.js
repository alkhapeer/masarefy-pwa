// ads.js — يحجز أماكن الإعلانات ويحمّل المزود حسب config.js
(function(){
  const C = window.CONFIG || {};
  const provider = (C.ADS_PROVIDER || 'none').toLowerCase();

  function inject(container, html){
    const el = document.getElementById(container);
    if(!el) return;
    el.innerHTML = html;
  }

  if (provider === 'adsense' && C.ADSENSE_CLIENT_ID){
    // load adsense
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(C.ADSENSE_CLIENT_ID)}`;
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);

    // hero
    inject('ad-hero', `
      <ins class="adsbygoogle"
        style="display:block; text-align:center; min-height:120px"
        data-ad-client="${C.ADSENSE_CLIENT_ID}"
        data-ad-slot="${C.ADSENSE_SLOT_HERO||''}"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    `);
    // top
    inject('ad-top', `
      <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="${C.ADSENSE_CLIENT_ID}"
        data-ad-slot="${C.ADSENSE_SLOT_TOP||''}"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    `);
    // bottom
    inject('ad-bottom', `
      <ins class="adsbygoogle"
        style="display:block; min-height:70px"
        data-ad-client="${C.ADSENSE_CLIENT_ID}"
        data-ad-slot="${C.ADSENSE_SLOT_BOTTOM||''}"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    `);

    // attempt to render
    window.adsbygoogle = window.adsbygoogle || [];
    setTimeout(()=>{
      try{ (adsbygoogle = window.adsbygoogle || []).push({}); }catch(e){}
      try{ (adsbygoogle = window.adsbygoogle || []).push({}); }catch(e){}
      try{ (adsbygoogle = window.adsbygoogle || []).push({}); }catch(e){}
    }, 500);
  } else if (provider === 'propeller' && C.PROPELLER_PUBLISHER_ID){
    inject('ad-hero', `<div>/* Propeller hero zone here */</div>`);
    inject('ad-top', `<div>/* Propeller top banner */</div>`);
    inject('ad-bottom', `<div>/* Propeller bottom banner */</div>`);
    // TODO: أضف سكربت Propeller الرسمي وقيم zones عندك
  } else if (provider === 'adsterra' && C.ADSTERRA_ZONE_ID){
    inject('ad-hero', `<div>/* Adsterra hero zone here */</div>`);
    inject('ad-top', `<div>/* Adsterra top banner */</div>`);
    inject('ad-bottom', `<div>/* Adsterra bottom banner */</div>`);
    // TODO: أضف سكربت Adsterra الرسمي وقيم zone
  } else {
    // no-ads
    inject('ad-hero', ``);
    inject('ad-top', ``);
    inject('ad-bottom', ``);
  }
})();