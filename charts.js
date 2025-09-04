// charts.js — يرسم Pie و Bar باستخدام Chart.js الحقيقي بعد تحميله من CDN
function getData(){
  try{ return JSON.parse(localStorage.getItem('me_expenses')||'[]'); }catch(e){ return []; }
}
function sum(arr){ return arr.reduce((a,b)=> a + Number(b||0), 0); }

window.renderCharts = function(){
  if (!window.Chart) return; // لم يكتمل التحميل بعد
  const list = getData();
  const ctxPie = document.getElementById('pieChart').getContext('2d');
  const ctxBar = document.getElementById('barChart').getContext('2d');

  // by category
  const byCat = {};
  list.forEach(e=>{ const k=(e.category||'other').trim(); byCat[k]=(byCat[k]||0)+Number(e.amount||0); });
  const labelsPie = Object.keys(byCat);
  const dataPie = Object.values(byCat);

  // by day (current month)
  const today = new Date().toISOString().slice(0,10);
  const month = today.slice(0,7);
  const byDay = {};
  list.filter(e=>(e.date||'').startsWith(month)).forEach(e=>{ byDay[e.date]=(byDay[e.date]||0)+Number(e.amount||0); });
  const labelsBar = Object.keys(byDay).sort();
  const dataBar = labelsBar.map(k=>byDay[k]);

  // destroy old instances if exist
  if (window._chartPie){ window._chartPie.destroy(); }
  if (window._chartBar){ window._chartBar.destroy(); }

  window._chartPie = new Chart(ctxPie, {
    type: 'pie',
    data: { labels: labelsPie, datasets: [{ data: dataPie }]},
    options: { plugins: { legend: { position: 'bottom' } } }
  });

  window._chartBar = new Chart(ctxBar, {
    type: 'bar',
    data: { labels: labelsBar, datasets: [{ label: (window.I18nState?.lang==='ar'?'الإنفاق':'Spending'), data: dataBar }]},
    options: { scales: { y: { beginAtZero: true }}, plugins: { legend: { display: true, position:'bottom' } } }
  });
};