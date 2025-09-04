// charts.js stub (uses vendor/chart.min.js)
(function(){ let pie,bar; window.renderCharts=function(){ const p=document.getElementById('pieChart'); const b=document.getElementById('barChart'); if(!p||!b||!window.Chart) return;
  const byCat=window.computeByCategory(); const labels=Object.keys(byCat); const values=Object.values(byCat);
  if(pie) pie.destroy(); pie = new Chart(p, {type:'pie', data:{labels, datasets:[{data:values}]}});
  const perDay=window.computeDailyTotals(); const dLabels=Object.keys(perDay).sort(); const dValues=dLabels.map(k=>perDay[k]);
  if(bar) bar.destroy(); bar = new Chart(b, {type:'bar', data:{labels:dLabels, datasets:[{data:dValues}]}});
};})();