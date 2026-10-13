/* Hover and native navigation, quick planning, and browser-local saved tours. */
(function (root) {
  'use strict';
  const node = typeof module === 'object' && module.exports;
  const tours = node ? require('./tour-data.js') : root.DavidTourData;
  const known = new Set(tours.map(t => t.id));
  const key = 'david-explora-saved-tours';
  function cleanSaved(value) { return Array.isArray(value) ? [...new Set(value.filter(id => typeof id === 'string' && known.has(id)))].slice(0,tours.length) : []; }
  function readSaved(storage) { try { return cleanSaved(JSON.parse(storage.getItem(key) || '[]')); } catch { return []; } }
  function toggleSaved(ids,id) { if (!known.has(id)) return cleanSaved(ids); const set = new Set(cleanSaved(ids)); set.has(id) ? set.delete(id) : set.add(id); return [...set].slice(0,tours.length); }
  function quickPlan(values,today) {
    const destinations = new Set(['Safari','Kilimanjaro','Zanzibar','Local Tanzania']);
    const travelers = Number(values.travelers), date = String(values.date || ''), errors=[];
    if (!destinations.has(values.destination)) errors.push('Choose a travel interest.');
    if (!Number.isInteger(travelers) || travelers < 1 || travelers > 50) errors.push('Choose between 1 and 50 travellers.');
    if (date) {
      const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
      const parsed = match ? new Date(Date.UTC(Number(match[1]),Number(match[2])-1,Number(match[3]))) : null;
      if (!match || !parsed || parsed.toISOString().slice(0,10)!==date || date<today) errors.push('Choose a valid arrival date today or later.');
    }
    return {errors,destination:values.destination,date,travelers};
  }
  function setupNavigation(nav, groups, env) {
    const doc = env.document;
    const desktop = env.matchMedia('(min-width: 1301px) and (hover: hover) and (pointer: fine)');
    const state = new Map(groups.map(group => [group, {timer:null, inside:false, dismissed:false}]));
    function cancel(group) {
      const item = state.get(group);
      if (item.timer !== null) env.clearTimeout(item.timer);
      item.timer = null;
    }
    function close(group) { cancel(group); group.open = false; }
    function open(group) {
      cancel(group);
      groups.forEach(other => { if (other !== group) close(other); });
      group.open = true;
    }
    function leave(group) {
      cancel(group);
      const item = state.get(group);
      item.timer = env.setTimeout(() => {
        item.timer = null;
        if (!item.inside && !group.contains(doc.activeElement)) group.open = false;
      }, 180);
    }
    groups.forEach(group => {
      group.addEventListener('pointerenter', event => {
        if (!desktop.matches || event.pointerType === 'touch') return;
        const item = state.get(group);
        item.inside = true;
        cancel(group);
        if (!item.dismissed) open(group);
      });
      group.addEventListener('pointerleave', () => {
        const item = state.get(group);
        item.inside = false;
        item.dismissed = false;
        if (desktop.matches) leave(group);
      });
      group.addEventListener('focusout', event => {
        if (!group.contains(event.relatedTarget) && desktop.matches) leave(group);
      });
      group.addEventListener('toggle', () => {
        if (group.open) groups.forEach(other => { if (other !== group) close(other); });
      });
      group.addEventListener('keydown', event => {
        if (event.key === 'Escape' && group.open) {
          close(group);
          state.get(group).dismissed = true;
          event.stopPropagation();
          group.querySelector('summary').focus();
        }
      });
    });
    doc.addEventListener('click', event => {
      if ((nav && !nav.contains(event.target)) || event.target.closest('.main-nav a')) groups.forEach(close);
    });
    desktop.addEventListener('change', () => {
      groups.forEach(group => { close(group); Object.assign(state.get(group), {inside:false, dismissed:false}); });
    });
  }
  const api={cleanSaved,readSaved,toggleSaved,quickPlan,setupNavigation};
  if (node) { module.exports=api;return; }
  let saved=[];
  try { saved=readSaved(root.localStorage); } catch { /* Saving still works for this visit. */ }
  api.savedTours=()=>[...saved]; root.DavidFeatures=api;
  const doc=root.document;
  function refreshSaved() {
    doc.querySelectorAll('[data-save-tour]').forEach(button=>{
      const on=saved.includes(button.dataset.saveTour);
      button.setAttribute('aria-pressed',String(on));
      button.querySelector('[data-save-label]').textContent=on?'Saved':'Save tour';
      const tour=tours.find(t=>t.id===button.dataset.saveTour);
      button.setAttribute('aria-label',(on?'Remove saved tour: ':'Save tour: ')+tour.title);
    });
    root.dispatchEvent(new Event('david:saved-changed'));
  }
  doc.querySelectorAll('[data-tour-actions]').forEach(actions=>{actions.hidden=false;});
  doc.querySelectorAll('[data-save-tour]').forEach(button=>button.addEventListener('click',()=>{
    saved=toggleSaved(saved,button.dataset.saveTour);let persisted=true;
    try {root.localStorage.setItem(key,JSON.stringify(saved));} catch {persisted=false;}
    refreshSaved();
    button.closest('.package-card').querySelector('[data-card-status]').textContent=saved.includes(button.dataset.saveTour)?(persisted?'Saved on this browser. View your shortlist in All tours.':'Saved for this visit. Browser storage is unavailable.'):'Removed from your saved tours.';
  }));
  root.addEventListener('storage',event=>{if(event.key===key){try{saved=readSaved(root.localStorage);}catch{saved=[];}refreshSaved();}});
  doc.querySelectorAll('[data-share-tour]').forEach(button=>button.addEventListener('click',async()=>{
    const status=button.closest('.package-card').querySelector('[data-card-status]');
    const base=doc.querySelector('link[rel="canonical"]')?.href || root.location.href;
    const url=new URL(button.dataset.shareTour+'.html',base).href;
    try {await root.navigator.clipboard.writeText(url);status.textContent='Tour link copied. Paste it into your conversation.';} catch {status.textContent='Copy this tour link: '+url;}
  }));
  doc.querySelectorAll('[data-print-itinerary]').forEach(button=>{button.hidden=false;button.addEventListener('click',()=>root.print());});
  let printedDetails=[];
  root.addEventListener('beforeprint',()=>{printedDetails=[...doc.querySelectorAll('.day-accordion')].map(detail=>[detail,detail.open]);printedDetails.forEach(([detail])=>{detail.open=true;});});
  root.addEventListener('afterprint',()=>{printedDetails.forEach(([detail,open])=>{detail.open=open;});printedDetails=[];});
  const nav=doc.querySelector('.main-nav'), groups=[...doc.querySelectorAll('.nav-group')];
  setupNavigation(nav,groups,root);
  const quick=doc.querySelector('#quick-plan-form');
  if(quick){
    const now=new Date(),today=String(now.getFullYear())+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
    doc.querySelector('#quick-date').min=today;
    quick.addEventListener('submit',event=>{
      event.preventDefault();const result=quickPlan({destination:quick.querySelector('input[name="quick-interest"]:checked')?.value,date:doc.querySelector('#quick-date').value,travelers:doc.querySelector('#quick-travelers').value},today);
      const status=doc.querySelector('#quick-plan-status');status.textContent=result.errors.join(' ');if(result.errors.length)return;
      const packageField=doc.querySelector('#trip-package');packageField.value='';packageField.dispatchEvent(new Event('change',{bubbles:true}));
      for(const [id,value] of [['trip-destination',result.destination],['traveler-count',result.travelers],['travel-date',result.date]]){const field=doc.getElementById(id);field.value=value;field.dispatchEvent(new Event('change',{bubbles:true}));}
      const contact=doc.querySelector('#contact');contact.scrollIntoView({behavior:root.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
      doc.querySelector('#customer-name').focus({preventScroll:true});
      doc.querySelector('#inquiry-status').textContent='Your starting details are added. Complete the remaining fields, then review your message before sending.';
    });
  }
  refreshSaved();
})(typeof globalThis==='undefined'?this:globalThis);
