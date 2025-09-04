import { getExpenses, getSettings } from './storage.js';
import { formatAmount } from './utils.js';
function sum(list){ return list.reduce((a,b)=> a + Number(b.amount||0), 0); }
export function buildTips(){
  const tips = [];
  const list = getExpenses();
  if (!list.length) return tips;
  const s = getSettings();
  const budget = Number(s.monthlyBudget || 0);
  const today = new Date().toISOString().slice(0,10);
  const month = today.slice(0,7);
  const monthList = list.filter(e => (e.date||'').startsWith(month));
  const todayList = list.filter(e => e.date === today);
  const spentMonth = sum(monthList);
  const spentToday = sum(todayList);
  if (budget > 0) {
    const remaining = budget - spentMonth;
    if (remaining < 0) {
      tips.push({type:'warn', text: (window.I18nState.lang==='ar' ? `تجاوزت الميزانية هذا الشهر بـ ${formatAmount(Math.abs(remaining))}. قلّل من الإنفاق في أعلى تصنيف.` : `You exceeded the monthly budget by ${formatAmount(Math.abs(remaining))}. Cut your top category.`)});
    } else if (remaining < budget * 0.1) {
      tips.push({type:'warn', text: (window.I18nState.lang==='ar' ? `المتبقي من الميزانية قليل: ${formatAmount(remaining)}.` : `Budget is low: ${formatAmount(remaining)}.`)});
    } else {
      tips.push({type:'hint', text: (window.I18nState.lang==='ar' ? `متبقّي هذا الشهر: ${formatAmount(remaining)}.` : `Remaining this month: ${formatAmount(remaining)}.`)});
    }
    if (spentMonth > budget * 0.4) {
      tips.push({type:'warn', text: (window.I18nState.lang==='ar' ? `أنفقت أكثر من 40% من دخلك. جرّب قاعدة 50/30/20.` : `Spending exceeds 40% of income. Try the 50/30/20 rule.`)});
    }
  }
  const coffeeKeys=['coffee','قهوة']; const dineKeys=['مطاعم','اكل','طعام','restaurant','dine','food'];
  const coffeeSpend = monthList.filter(e => coffeeKeys.some(k => (e.category||e.name||'').toLowerCase().includes(k))).reduce((a,b)=>a+Number(b.amount||0),0);
  const dineSpend = monthList.filter(e => dineKeys.some(k => (e.category||e.name||'').toLowerCase().includes(k))).reduce((a,b)=>a+Number(b.amount||0),0);
  if (budget>0 && coffeeSpend >= budget*0.05){
    tips.push({type:'hint', text:(window.I18nState.lang==='ar'?`إنفاق القهوة مرتفع. حضّرها في المنزل يومين بالأسبوع لتوفّر ~${formatAmount(coffeeSpend*0.3)}.`:`Coffee spend is high. Brew at home 2 days/week to save ~${formatAmount(coffeeSpend*0.3)}.`)});
  }
  if (budget>0 && dineSpend >= budget*0.15){
    tips.push({type:'hint', text:(window.I18nState.lang==='ar'?`المطاعم مرتفعة. الطبخ المنزلي 3 أيام/أسبوع قد يوفّر ~${formatAmount(dineSpend*0.25)}.`:`Dining out is high. Cooking at home 3 days/week could save ~${formatAmount(dineSpend*0.25)}.`)});
  }
  const day = new Date().getDate(); const avgDay = spentMonth / Math.max(1, day);
  if (spentToday > avgDay * 1.8 && spentToday > 0) {
    tips.push({type:'warn', text:(window.I18nState.lang==='ar'?`إنفاق اليوم أعلى بكثير من متوسط الأيام. راجع مشترياتك اليوم.`:`Today's spending is much higher than average. Review today's purchases.`)});
  }
  const byCat = {}; monthList.forEach(e=>{ const k=(e.category||'other').trim(); byCat[k]=(byCat[k]||0)+Number(e.amount||0); });
  const top = Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0];
  if (top){ tips.push({type:'hint', text:(window.I18nState.lang==='ar'?`أعلى تصنيف هذا الشهر: ${top[0]} (${formatAmount(top[1])}).`:`Top category this month: ${top[0]} (${formatAmount(top[1])}).`)}); }
  return tips;
}