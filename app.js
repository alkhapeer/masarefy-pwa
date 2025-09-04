import { t, toggleLanguage } from './i18n.js';
import { uuid, formatAmount, formatDateISO, toast } from './utils.js';
import { getExpenses, addExpense, updateExpense, deleteExpense, clearAll, getSettings, setSettings } from './storage.js';
import { buildTips } from './tips.js';

function sum(list){ return list.reduce((a,b)=> a + Number(b.amount||0), 0); }

function computeByCategory(){
  const map={}; getExpenses().forEach(e=>{
    const k=(e.category||'').trim()||'other';
    map[k]=(map[k]||0)+Number(e.amount||0);
  });
  return map;
}

function recalcSummary(){
  const list = getExpenses();
  const today = new Date().toISOString().slice(0,10);
  const month = today.slice(0,7);

  const todayList = list.filter(e => e.date === today);
  const monthList = list.filter(e => (e.date||'').startsWith(month));

  const totalToday = sum(todayList);
  const totalMonth = sum(monthList);

  const s = getSettings();
  const budget = Number(s.monthlyBudget || 0);
  const remaining = budget ? (budget - totalMonth) : 0;

  const byCat = computeByCategory();
  const topCat = Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0]?.[0] || '-';

  document.getElementById('spentToday').textContent = formatAmount(totalToday);
  document.getElementById('spentMonth').textContent = formatAmount(totalMonth);
  document.getElementById('remainingMonth').textContent = budget ? formatAmount(remaining) : '--';

  document.getElementById('totalToday').textContent = formatAmount(totalToday);
  document.getElementById('totalMonth').textContent = formatAmount(totalMonth);
  document.getElementById('topCategory').textContent = topCat;
  document.getElementById('budgetBox').classList.toggle('over', budget>0 && remaining<0);
}

function filterExpenses(list){
  const cat=document.getElementById('filterCat').value;
  const from=document.getElementById('filterFrom').value;
  const to=document.getElementById('filterTo').value;
  return list.filter(e=>{
    if (cat && !((e.category||'').toLowerCase().includes(cat.toLowerCase()))) return false;
    if (from && e.date < from) return false;
    if (to && e.date > to) return false;
    return true;
  });
}

function renderList(){
  const tbody=document.getElementById('expensesBody');
  const list=filterExpenses(getExpenses());
  tbody.innerHTML='';
  list.forEach(e=>{
    const tr=document.createElement('tr');
    tr.innerHTML = `
      <td>${e.name||'-'}</td>
      <td>${e.category||'-'}</td>
      <td>${e.date}</td>
      <td>${Number(e.amount||0)}</td>
      <td>
        <button class="btn small edit">✏️</button>
        <button class="btn small del">🗑️</button>
      </td>`;
    tr.querySelector('.del').onclick=()=>{ deleteExpense(e.id); renderAll(); toast(t('toast_deleted')); window.track && window.track('expense_delete'); };
    tr.querySelector('.edit').onclick=()=>{
      openModal();
      document.getElementById('id').value=e.id;
      document.getElementById('name').value=e.name;
      document.getElementById('amount').value=e.amount;
      document.getElementById('category').value=e.category;
      document.getElementById('date').value=e.date;
      document.getElementById('note').value=e.note||'';
    };
    tbody.appendChild(tr);
  });
}

function refreshCategorySuggestions(){
  const dl=document.getElementById('catList'); if(!dl) return;
  const set=new Set();
  getExpenses().forEach(e=>{ const v=(e.category||'').trim(); if(v) set.add(v); });
  dl.innerHTML = Array.from(set).slice(0,50).map(v=>`<option value="${v}"></option>`).join('');
}

function renderTips(){
  const ul = document.getElementById('tipsList');
  ul.innerHTML = '';
  const items = buildTips();
  items.forEach(ti=>{
    const li=document.createElement('li');
    li.className = ti.type==='warn' ? 'warn' : 'hint';
    li.textContent = ti.text;
    ul.appendChild(li);
  });
}

function renderSettings(){
  const s=getSettings();
  document.getElementById('monthlyBudget').value = s.monthlyBudget || '';
  document.getElementById('currencySymbol').value = s.currencySymbol || (window.CONFIG?.CURRENCY_SYMBOL || 'ج.م');
  document.getElementById('numberLocale').value = s.numberLocale || (window.CONFIG?.NUMBER_LOCALE || 'ar-EG');
}

function saveSettings(){
  setSettings({
    monthlyBudget: document.getElementById('monthlyBudget').value,
    currencySymbol: document.getElementById('currencySymbol').value || (window.CONFIG?.CURRENCY_SYMBOL || 'ج.م'),
    numberLocale: document.getElementById('numberLocale').value || (window.CONFIG?.NUMBER_LOCALE || 'ar-EG')
  });
  toast(t('toast_settings_saved'));
  window.track && window.track('settings_update');
  renderAll();
}

function showTab(tab){
  document.querySelectorAll('[data-section]').forEach(s => s.classList.toggle('active', s.getAttribute('data-section') === tab));
  document.querySelectorAll('.tabbar .tab').forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tab));
  if (tab === 'charts' && typeof window.renderCharts === 'function') window.renderCharts();
}

function openModal(){ document.getElementById('addModal').style.display='block'; }
function closeModal(){ document.getElementById('addModal').style.display='none'; }

function renderAll(){
  recalcSummary(); renderList(); refreshCategorySuggestions(); renderTips();
  if (typeof window.renderCharts === 'function') window.renderCharts();
}
window.rerenderAll = renderAll;

window.addEventListener('DOMContentLoaded', ()=>{
  const $form = document.getElementById('form');
  const $date = document.getElementById('date');
  $date.value = formatDateISO(new Date());

  $form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const $id = document.getElementById('id');
    const item = {
      id: ($id.value || uuid()),
      name: document.getElementById('name').value.trim(),
      amount: Number(document.getElementById('amount').value || 0),
      category: document.getElementById('category').value.trim(),
      date: $date.value || formatDateISO(new Date()),
      note: document.getElementById('note').value.trim()
    };
    if ($id.value) { updateExpense(item.id, item); toast(t('toast_updated')); }
    else { addExpense(item); toast(t('toast_added')); window.track && window.track('expense_add', {amount:item.amount}); }
    $form.reset(); $id.value=''; $date.value=formatDateISO(new Date());
    renderAll(); closeModal();
  });

  document.getElementById('resetData').addEventListener('click', ()=>{
    if (confirm(t('confirm_reset'))){ clearAll(); renderAll(); }
  });
  document.getElementById('applyFilters').addEventListener('click', renderAll);
  document.getElementById('resetFilters').addEventListener('click', ()=>{
    filterCat.value=''; filterFrom.value=''; filterTo.value=''; renderAll();
  });
  document.getElementById('saveSettings').addEventListener('click', saveSettings);

  document.getElementById('langToggle').addEventListener('click', ()=> toggleLanguage());

  document.querySelectorAll('.tabbar .tab').forEach(btn=>
    btn.addEventListener('click', ()=> showTab(btn.getAttribute('data-tab')) )
  );

  document.getElementById('fabAdd')?.addEventListener('click', ()=>{ document.getElementById('id').value=''; openModal(); });
  document.querySelector('#addModal .close').onclick=closeModal;

  renderSettings(); renderAll();
  window.track && window.track('app_open');
});

// SW backup
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js'));
}
