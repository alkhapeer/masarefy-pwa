// utils.js
export function getSettingsRaw(){ try{return JSON.parse(localStorage.getItem('me_settings')||'{}');}catch(e){return{};} }
export function getNumberLocale(){ const s=getSettingsRaw(); return s.numberLocale||'en-US'; }
export function getCurrencySymbol(){ const s=getSettingsRaw(); return s.currencySymbol||(window.APP_CONFIG.CURRENCY_SYMBOL||'$'); }
export function formatAmount(x,currency){ const n=Number(x||0); const sym=currency||getCurrencySymbol(); const loc=getNumberLocale(); return `${n.toLocaleString(loc,{minimumFractionDigits:0, maximumFractionDigits:2})} ${sym}`; }
export function formatDateISO(d){ const dt=d instanceof Date? d : new Date(d); return dt.toISOString().slice(0,10); }
export function uuid(){ return 'xxyyxy'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&0x3|0x8);return v.toString(16);})+'-'+Date.now().toString(36); }
export function toast(msg){ const t=document.createElement('div'); t.className='toasty'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.classList.add('show'),10); setTimeout(()=>{t.classList.remove('show'); setTimeout(()=>t.remove(),300);},2000); }