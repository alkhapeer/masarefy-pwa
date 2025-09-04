window.I18N={
  ar:{ app_title:"مصاريفي | My Expenses", add_expense:"إضافة مصروف", name:"الاسم/الوصف", amount:"المبلغ",
       category_free:"التصنيف", category_ph:"اكتب تصنيفًا (حر)", date:"التاريخ", note_optional:"ملاحظة (اختياري)",
       save:"حفظ", expenses:"المصاريف", actions:"إجراءات", delete:"حذف", edit:"تعديل",
       total_today:"إجمالي اليوم", total_month:"إجمالي الشهر", remaining_budget:"المتبقي من الميزانية",
       set_budget:"إعدادات", filters:"بحث/تصفية", filter_category:"تصنيف", filter_date_from:"من تاريخ", filter_date_to:"إلى تاريخ",
       apply_filters:"تطبيق", reset_filters:"إعادة تعيين", reset_data:"مسح البيانات", confirm_reset:"هل أنت متأكد من مسح كل البيانات؟",
       language:"اللغة", install_app:"📲 ثبّت التطبيق", privacy:"الخصوصية", highest_category:"أعلى تصنيف إنفاق",
       charts:"الرسوم البيانية", pie_title:"توزيع المصروفات بالتصنيفات", bar_title:"الإنفاق اليومي",
       toast_added:"تمت الإضافة", toast_updated:"تم التحديث", toast_deleted:"تم الحذف", toast_settings_saved:"تم حفظ الإعدادات",
       budget_placeholder:"مثال: 3000", lang_toggle:"EN", number_locale:"تنسيق الأرقام", currency_symbol:"رمز العملة",
       daily_title:"مصاريف اليوم", monthly_title:"الشهر الحالي", spent:"المصروف", remaining:"المتبقي", tips:"نصائح ذكية" },
  en:{ app_title:"Masarefy | My Expenses", add_expense:"Add Expense", name:"Name/Description", amount:"Amount",
       category_free:"Category", category_ph:"Type a category", date:"Date", note_optional:"Note (optional)",
       save:"Save", expenses:"Expenses", actions:"Actions", delete:"Delete", edit:"Edit",
       total_today:"Total Today", total_month:"Total This Month", remaining_budget:"Remaining Budget",
       set_budget:"Settings", filters:"Search/Filter", filter_category:"Category", filter_date_from:"From", filter_date_to:"To",
       apply_filters:"Apply", reset_filters:"Reset", reset_data:"Clear Data", confirm_reset:"Are you sure you want to clear all local data?",
       language:"Language", install_app:"📲 Add to Home Screen", privacy:"Privacy", highest_category:"Top Spending Category",
       charts:"Charts", pie_title:"Spending by Category", bar_title:"Daily Spending",
       toast_added:"Added", toast_updated:"Updated", toast_deleted:"Deleted", toast_settings_saved:"Settings saved",
       budget_placeholder:"e.g., 3000", lang_toggle:"ع", number_locale:"Number locale", currency_symbol:"Currency symbol",
       daily_title:"Today", monthly_title:"This Month", spent:"Spent", remaining:"Left", tips:"Smart Tips" }
};
window.I18nState={lang:'ar'};
function detectLanguage(){ const pref=(localStorage.getItem('lang')||'auto'); if(pref!=='auto') return pref; const nav=(navigator.language||'').toLowerCase(); return nav.startsWith('ar')?'ar':'en'; }
function applyLanguage(lang){ window.I18nState.lang=lang; localStorage.setItem('lang',lang); const dict=window.I18N[lang]; document.documentElement.lang=lang; document.documentElement.dir= lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{ const k=el.getAttribute('data-i18n'); if(dict[k]) el.textContent=dict[k];});
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{ const k=el.getAttribute('data-i18n-ph'); if(dict[k]) el.setAttribute('placeholder', dict[k]);});
  const lt=document.getElementById('langToggle'); if(lt) lt.textContent = dict.lang_toggle || (lang==='ar'?'EN':'ع');
}
function t(key){ const d=window.I18N[window.I18nState.lang]||window.I18N.ar; return d[key]||key; }
function toggleLanguage(){ const lang=window.I18nState.lang==='ar'?'en':'ar'; applyLanguage(lang); if(typeof window.renderCharts==='function'){ window.renderCharts(); } if(typeof window.rerenderAll==='function'){ window.rerenderAll(); } }
window.addEventListener('DOMContentLoaded', ()=>{ const cfg=window.CONFIG||{}; if(cfg.DEFAULT_LANGUAGE && cfg.DEFAULT_LANGUAGE!=='auto'){ applyLanguage(cfg.DEFAULT_LANGUAGE);} else { applyLanguage(detectLanguage()); } });
window.t=t; window.toggleLanguage=toggleLanguage;
