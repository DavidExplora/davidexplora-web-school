/* Searchable guides, a browser-local reading list and factual journey comparisons. */
(function(root){
  'use strict';
  const node=typeof module==='object'&&module.exports;
  const data=node?require('./journal-data.js'):root.DavidJournalData;
  const tours=node?require('./tour-data.js'):root.DavidTourData;
  const known=new Set(data.articles.map(a=>a.id));
  const special=new Set(data.journeys.map(j=>j.id));
  const categories=new Set(data.articles.map(a=>a.category));
  const storageKey='david-explora-reading-list';
  function cleanReading(value){return Array.isArray(value)?[...new Set(value.filter(id=>typeof id==='string'&&known.has(id)))]:[];}
  function readReading(storage){try{return cleanReading(JSON.parse(storage.getItem(storageKey)||'[]'));}catch{return [];}}
  function toggleReading(ids,id){const saved=new Set(cleanReading(ids));if(known.has(id))saved.has(id)?saved.delete(id):saved.add(id);return [...saved];}
  function filterArticles(options={}){
    const query=String(options.query||'').trim().toLocaleLowerCase();
    const category=categories.has(options.category)?options.category:'all';
    const saved=Array.isArray(options.savedIds)?new Set(cleanReading(options.savedIds)):null;
    return data.articles.filter(a=>(category==='all'||a.category===category)&&(!saved||saved.has(a.id))&&(!query||[a.title,a.category,a.excerpt,a.searchText].join(' ').toLocaleLowerCase().includes(query)));
  }
  function compareIds(value){return Array.isArray(value)?[...new Set(value.filter(id=>typeof id==='string'&&special.has(id)))].slice(0,3):[];}
  function comparisonRows(ids){
    return compareIds(ids).map(id=>{
      const tour=tours.find(t=>t.id===id);
      return {id,title:tour.title,duration:tour.duration,nights:tour.nights,mountainDays:tour.mountainDays||0,audience:data.journeys.find(j=>j.id===id).for,start:tour.start,places:[...tour.places],price:'Personal quote for your dates and group',support:'No donation or school visit included'};
    });
  }
  function readingProgress(scroll,top,height,viewport){
    const distance=Math.max(1,height-viewport);
    return Math.max(0,Math.min(100,Math.round((scroll-top)/distance*100)));
  }
  const api={cleanReading,readReading,toggleReading,filterArticles,compareIds,comparisonRows,readingProgress};
  if(node){module.exports=api;return;}
  root.DavidJournal=api;
  const doc=root.document;
  let reading=[];
  try{reading=readReading(root.localStorage);}catch{/* Reading list remains available for this visit. */}
  let applyLibrary=()=>{};
  function refreshReading(){
    doc.querySelectorAll('[data-save-article]').forEach(button=>{
      const article=data.articles.find(a=>a.id===button.dataset.saveArticle);
      if(!article)return;
      const on=reading.includes(article.id);
      button.hidden=false;button.textContent=on?'Saved guide':'Save for later';
      button.setAttribute('aria-pressed',String(on));
      button.setAttribute('aria-label',(on?'Remove saved guide: ':'Save guide: ')+article.title);
    });
    applyLibrary(false);
  }
  doc.querySelectorAll('[data-save-article]').forEach(button=>button.addEventListener('click',()=>{
    reading=toggleReading(reading,button.dataset.saveArticle);
    let persisted=true;
    try{root.localStorage.setItem(storageKey,JSON.stringify(reading));}catch{persisted=false;}
    refreshReading();
    if(button.closest('[data-article-id]')?.hidden)doc.getElementById('journal-saved')?.focus();
    const status=button.closest('[data-article-id], [data-reading-article]').querySelector('[data-article-status]');
    status.textContent=reading.includes(button.dataset.saveArticle)?(persisted?'Saved on this browser. Find it in the journal’s reading list.':'Saved for this visit. Browser storage is unavailable.'):'Removed from your reading list.';
  }));
  root.addEventListener('storage',event=>{
    if(event.key!==storageKey&&event.key!==null)return;
    try{reading=readReading(root.localStorage);}catch{reading=[];}
    refreshReading();
  });
  const library=doc.querySelector('[data-journal-library]');
  if(library){
    const form=doc.getElementById('journal-filters'),query=doc.getElementById('journal-query'),category=doc.getElementById('journal-category'),saved=doc.getElementById('journal-saved');
    const params=new URLSearchParams(root.location.search);
    query.value=(params.get('q')||'').slice(0,120);
    category.value=categories.has(params.get('category'))?params.get('category'):'all';
    saved.checked=params.get('saved')==='1';form.hidden=false;
    applyLibrary=sync=>{
      const matches=new Set(filterArticles({query:query.value,category:category.value,savedIds:saved.checked?reading:undefined}).map(a=>a.id));
      library.querySelectorAll('[data-article-id]').forEach(card=>{card.hidden=!matches.has(card.dataset.articleId);});
      doc.getElementById('journal-count').textContent=matches.size+' '+(matches.size===1?'guide':'guides')+' to explore'+(saved.checked?' in your reading list':'');
      doc.getElementById('journal-empty').hidden=matches.size!==0;
      if(sync){
        const url=new URL(root.location.href);
        for(const [key,value] of [['q',query.value.trim()],['category',category.value==='all'?'':category.value],['saved',saved.checked?'1':'']])value?url.searchParams.set(key,value):url.searchParams.delete(key);
        try{root.history.replaceState(null,'',url.href);}catch{/* Browsing and filtering still work in a local file preview. */}
      }
    };
    form.addEventListener('submit',event=>{event.preventDefault();applyLibrary(true);});
    form.addEventListener('input',()=>applyLibrary(true));
    form.addEventListener('change',()=>applyLibrary(true));
    doc.getElementById('journal-reset').addEventListener('click',()=>{query.value='';category.value='all';saved.checked=false;applyLibrary(true);});
  }
  refreshReading();

  const compare=doc.querySelector('[data-journey-comparison]');
  if(compare){
    let selected=[];
    const choices=[...doc.querySelectorAll('[data-compare-tour]')];
    const table=compare.querySelector('table'),status=compare.querySelector('[data-compare-status]');
    doc.querySelectorAll('.journey-compare-choice').forEach(choice=>{choice.hidden=false;});
    function render(){
      const ids=selected.length?selected:data.journeys.map(j=>j.id);
      // The unfiltered, all-four view is the no-JavaScript baseline too.
      const entries=ids.map(id=>comparisonRows([id])[0]);
      const head=doc.createElement('thead'),line=doc.createElement('tr'),first=doc.createElement('th');
      first.scope='col';first.textContent='Detail';line.append(first);
      entries.forEach(item=>{const th=doc.createElement('th'),link=doc.createElement('a');th.scope='col';link.href=item.id+'.html';link.textContent=item.title;th.append(link);line.append(th);});head.append(line);
      const body=doc.createElement('tbody');
      const rows=[['Duration',item=>item.duration],['Overnights',item=>item.nights+' nights'],['Mountain time',item=>item.mountainDays?item.mountainDays+' mountain days':'No summit trek'],['Best fit',item=>item.audience],['Starts / ends',item=>item.start],['Main experiences',item=>item.places.join(' · ')],['Price',item=>item.price],['Education support',item=>item.support]];
      rows.forEach(([label,value])=>{const row=doc.createElement('tr'),labelCell=doc.createElement('th');labelCell.scope='row';labelCell.textContent=label;row.append(labelCell);entries.forEach(item=>{const cell=doc.createElement('td');cell.textContent=value(item);row.append(cell);});body.append(row);});
      table.querySelector('thead').replaceWith(head);table.querySelector('tbody').replaceWith(body);
      status.textContent=selected.length?'Comparing '+selected.length+' selected '+(selected.length===1?'journey.':'journeys.'):'Showing all four special journeys.';
    }
    choices.forEach(choice=>choice.addEventListener('change',()=>{
      if(choice.checked&&selected.length===3){choice.checked=false;status.textContent='Choose up to three journeys. Remove one selection before adding another.';return;}
      selected=choice.checked?compareIds([...selected,choice.dataset.compareTour]):selected.filter(id=>id!==choice.dataset.compareTour);
      render();
    }));
  }
  const article=doc.querySelector('[data-reading-article]'),progress=doc.querySelector('[data-reading-progress]');
  if(article&&progress){
    let pending=false;progress.hidden=false;
    function update(){pending=false;const rect=article.getBoundingClientRect();progress.value=readingProgress(root.scrollY,rect.top+root.scrollY,rect.height,root.innerHeight);}
    function schedule(){if(pending||doc.hidden)return;pending=true;root.requestAnimationFrame(update);}
    root.addEventListener('scroll',schedule,{passive:true});root.addEventListener('resize',schedule);root.addEventListener('load',schedule);update();
  }
})(globalThis);
