// storage.js
const KEYS={EXPENSES:'me_expenses', SETTINGS:'me_settings'};
export function getSettings(){ try{return JSON.parse(localStorage.getItem(KEYS.SETTINGS)||'{}');}catch(e){return{};} }
export function setSettings(patch){ const s={...getSettings(),...patch}; localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s)); return s; }
export function getExpenses(){ try{return JSON.parse(localStorage.getItem(KEYS.EXPENSES)||'[]');}catch(e){return[];} }
export function saveExpenses(list){ localStorage.setItem(KEYS.EXPENSES, JSON.stringify(list)); }
export function addExpense(exp){ const list=getExpenses(); list.unshift(exp); saveExpenses(list); }
export function updateExpense(id,patch){ const list=getExpenses().map(x=>x.id===id?{...x,...patch}:x); saveExpenses(list); }
export function deleteExpense(id){ const list=getExpenses().filter(x=>x.id!==id); saveExpenses(list); }
export function clearAll(){ localStorage.removeItem(KEYS.EXPENSES); }