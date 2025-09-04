// tips.js
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

  // 1) الميزانية
  if (budget > 0) {
    const remaining = budget - spentMonth;
    if (remaining < 0) {
      tips.push({type:'warn', text:`تجاوزت الميزانية هذا الشهر بـ ${formatAmount(Math.abs(remaining))}. قلّل من الإنفاق في أعلى تصنيف.`});
    } else if (remaining < budget * 0.1) {
      tips.push({type:'warn', text:`المتبقي من الميزانية قليل: ${formatAmount(remaining)}.`});
    } else {
      tips.push({type:'hint', text:`متبقي هذا الشهر: ${formatAmount(remaining)}.`});
    }
    // 40% من الدخل
    if (spentMonth > budget * 0.4) {
      tips.push({type:'warn', text:`أنفقت أكثر من 40% من دخلك. جرّب قاعدة 50/30/20، وخفّض غير الضروريات.`});
    } else {
      tips.push({type:'hint', text:`حافظ على المصروفات الأساسية ≤50% من دخلك.`});
    }
  }

  // 2) تصنيف القهوة/المشروبات/المطاعم
  const coffeeKey = ['coffee','قهوة'];
  const dineKey = ['مطاعم','اكل','مطعم','food','dine','restaurant'];
  const coffeeSpend = monthList.filter(e => coffeeKey.some(k => (e.category||'').toLowerCase().includes(k))).reduce((a,b)=>a+Number(b.amount||0),0);
  const dineSpend = monthList.filter(e => dineKey.some(k => (e.category||'').toLowerCase().includes(k))).reduce((a,b)=>a+Number(b.amount||0),0);

  if (coffeeSpend > budget * 0.05) tips.push({type:'hint', text:`قهوة كتير هذا الشهر؟ جرّب إعداد القهوة في البيت يومين بالأسبوع لتوفّر ${formatAmount(coffeeSpend*0.3)} تقريبًا.`});
  if (dineSpend > budget * 0.15) tips.push({type:'hint', text:`المطاعم مرتفعة. اطبخ في البيت 3 أيام بالأسبوع لتوفّر ${formatAmount(dineSpend*0.25)}.`});

  // 3) قفزة مفاجئة اليوم
  const avgDay = spentMonth / Math.max(1, new Date().getDate());
  if (spentToday > avgDay * 1.8 && spentToday > 0) {
    tips.push({type:'warn', text:`إنفاق اليوم أعلى من المتوسط. راجع مشتريات اليوم.`});
  }

  // 4) أعلى تصنيف
  const byCat = {};
  monthList.forEach(e => { const k=(e.category||'other').trim(); byCat[k]=(byCat[k]||0)+Number(e.amount||0); });
  const top = Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0];
  if (top) tips.push({type:'hint', text:`أعلى تصنيف هذا الشهر: ${top[0]} (${formatAmount(top[1])}).`});

  return tips;
}
