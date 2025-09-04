// app.js
import { uuid, formatAmount, formatDateISO, toast, getCurrencySymbol } from './utils.js';
import { getExpenses, addExpense, updateExpense, deleteExpense, clearAll, getSettings, setSettings } from './storage.js';

window.computeByCategory=function(){ const map={}; getExpenses().forEach(e=>{ const k=(e.category||'').trim()||'other'; map[k]=(map[k]||0)+Number(e.amount||0);}); return map; };
window.computeDailyTotals=function(){ const map={}; getExpenses().forEach(e=>{ map[e.date]=(map[e.date]||0)+Number(e.amount||0);}); return map; };

function recalcSummary(){
  const list=getExpenses(); const today=new Date().toISOString().slice(0,10); const month=today.slice(0,7);
  const totalToday=list.filter(e=>e.date===today).reduce((a,b)=>a+Number(e.amount||0),0);
  const totalMonth=list.filter(e=>e.date.startsWith(month)).reduce((a,b)=>a+Number(e.amount||0),0);
  const byCat=window.computeByCategory(); const topCat=Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0]?.[0]||'-';
  const budget=Number(getSettings().monthlyBudget||0); const remaining=budget>0? budget-totalMonth : 0;
  document.getElementById('totalToday').textContent=formatAmount(totalToday);
  document.getElementById('totalMonth').textContent=formatAmount(totalMonth);
  document.getElementById('remainingBudget').textContent= budget? formatAmount(remaining): '--';
  document.getElementById('topCategory').textContent=topCat;
  document.getElementById('budgetBox').classList.toggle('over', budget>0 && remaining<0);
}
function filterExpenses(list){
  const cat=document.getElementById('filterCat').value; const from=document.getElementById('filterFrom').value; const to=document.getElementById('filterTo').value;
  return list.filter(e=>{ if(cat && !((e.category||'').toLowerCase().includes(cat.toLowerCase()))) return false; if(from && e.date<from) return false; if(to && e.date>to) return false; return true; });
}
function renderList(){
  const tbody=document.getElementById('expensesBody'); const list=filterExpenses(getExpenses()); tbody.innerHTML='';
  list.forEach(e=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${e.name||'-'}</td><td>${e.category||'-'}</td><td>${e.date}</td><td>${Number(e.amount||0)}</td><td><button class="btn small edit">✏️</button><button class="btn small del">🗑️</button></td>`;
    tr.querySelector('.del').onclick=()=>{ deleteExpense(e.id); renderAll(); toast(document.querySelector('[data-i18n="toast_deleted"]').textContent); };
    tr.querySelector('.edit').onclick=()=>{ if(typeof openModal==='function') openModal(); id.value=e.id; name.value=e.name; amount.value=e.amount; category.value=e.category; date.value=e.date; note.value=e.note||''; };
    tbody.appendChild(tr);
  });
}
function refreshCategorySuggestions(){ const dl=document.getElementById('catList'); if(!dl) return; const set=new Set(); getExpenses().forEach(e=>{ if(e.category) set.add(e.category.trim()); }); dl.innerHTML=Array.from(set).slice(0,50).map(v=>`<option value="${v}"></option>`).join(''); }
function renderSettings(){ const s=getSettings(); monthlyBudget.value=s.monthlyBudget||''; currencySymbol.value=s.currencySymbol||(window.APP_CONFIG.CURRENCY_SYMBOL||'$'); numberLocale.value=s.numberLocale||'en-US'; }
function renderAll(){ recalcSummary(); renderList(); refreshCategorySuggestions(); if(typeof window.renderCharts==='function'){ window.renderCharts(); } }

function submitForm(e){ e.preventDefault(); const theId=(id.value||uuid()); const item={ id: theId, name:name.value.trim(), amount:Number(amount.value||0), category:category.value.trim(), date:date.value||formatDateISO(new Date()), note:note.value.trim() };
  if(id.value){ updateExpense(theId,item); toast(document.querySelector('[data-i18n="toast_updated"]').textContent); } else { addExpense(item); toast(document.querySelector('[data-i18n="toast_added"]').textContent); if(typeof window.track==='function') track('expense_add',{currency:getCurrencySymbol()}); }
  form.reset(); id.value=''; renderAll();
}
function saveSettings(){ const s=setSettings({ monthlyBudget: monthlyBudget.value, currencySymbol: currencySymbol.value||'$', numberLocale: numberLocale.value||'en-US' }); toast(document.querySelector('[data-i18n="toast_settings_saved"]').textContent); if(typeof window.track==='function') track('settings_update', s); renderAll(); }
function showTab(tab){ document.querySelectorAll('[data-section]').forEach(s=> s.classList.toggle('active', s.getAttribute('data-section')===tab)); document.querySelectorAll('.tabbar .tab').forEach(b=> b.classList.toggle('active', b.getAttribute('data-tab')===tab)); if(typeof window.track==='function') track('tab_view',{tab}); if(tab==='charts' && typeof window.renderCharts==='function'){ window.renderCharts(); } }
function openModal(){ document.getElementById('addModal').style.display='block'; } function closeModal(){ document.getElementById('addModal').style.display='none'; }

// Onboarding banner (first visit, replaces splash)
function showOnboardingOnce(){
  const ONB_KEY='me_onboarded'; if(localStorage.getItem(ONB_KEY)==='yes') return;
  const ua=navigator.userAgent.toLowerCase(); const isIOS=/iphone|ipad|ipod/.test(ua); const isAndroid=/android/.test(ua);
  const banner=document.createElement('div'); banner.className='onboarding';
  banner.innerHTML=`<div class="onb-content"><strong>ثبّت التطبيق كـ PWA</strong>
  <div class="onb-steps">${isAndroid?'Android: من القائمة ⋮ اختر <b>Install app</b>.': isIOS?'iOS: زر المشاركة ثم <b>Add to Home Screen</b>.':'سطح المكتب: زر التثبيت من شريط العنوان أو قائمة المتصفح.'}</div>
  <div class="onb-actions"><button class="btn small" id="onbShowHow">طريقة التثبيت</button><button class="btn small" id="onbDismiss">تم</button></div></div>`;
  document.body.prepend(banner);
  document.getElementById('onbDismiss').onclick=()=>{ localStorage.setItem(ONB_KEY,'yes'); banner.remove(); };
  document.getElementById('onbShowHow').onclick=()=>{ const m=document.getElementById('installHowModal'); if(m){ m.style.display='block'; const c=m.querySelector('.close'); if(c) c.onclick=()=> m.style.display='none'; } };
}

window.addEventListener('DOMContentLoaded', ()=>{
  date.value = formatDateISO(new Date());
  form.addEventListener('submit',(e)=>{ submitForm(e); closeModal(); });
  resetData.addEventListener('click', ()=>{ if(confirm(document.querySelector('[data-i18n="confirm_reset"]').textContent)){ clearAll(); renderAll(); } });
  applyFilters.addEventListener('click', renderAll);
  resetFilters.addEventListener('click', ()=>{ filterCat.value=''; filterFrom.value=''; filterTo.value=''; renderAll(); });
  saveSettings.addEventListener('click', saveSettings);
  langToggle.addEventListener('click', ()=> toggleLanguage());
  showTab('home'); document.querySelectorAll('.tabbar .tab').forEach(btn=> btn.addEventListener('click', ()=> showTab(btn.getAttribute('data-tab')) ));
  fabAdd.addEventListener('click', ()=>{ id.value=''; openModal(); });
  document.querySelector('#addModal .close').onclick=closeModal;
  renderSettings(); renderAll(); showOnboardingOnce();
});

if('serviceWorker' in navigator){ window.addEventListener('load', ()=> navigator.serviceWorker.register('service-worker.js') ); }