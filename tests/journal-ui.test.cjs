'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const data=require('../journal-data.js'),tours=require('../tour-data.js');
const code=fs.readFileSync('journal.js','utf8');
class Element{
  constructor(){this.events={};this.dataset={};this.attrs={};this.children=[];this.hidden=false;this.textContent='';}
  addEventListener(type,fn){(this.events[type]??=[]).push(fn);}
  fire(type,event={}){for(const fn of this.events[type]??[])fn({target:this,...event});}
  setAttribute(name,value){this.attrs[name]=value;}
  append(child){child.parent=this;this.children.push(child);}
  replaceWith(node){const index=this.parent.children.indexOf(this);node.parent=this.parent;this.parent.children[index]=node;}
  querySelector(selector){return this.children.find(c=>c.tag===selector)||null;}
  focus(){this.focused=true;}
}
function fixture(search='',blocked=false,compareMode=false){
  const doc=new Element(),fields={};
  for(const id of ['journal-filters','journal-query','journal-category','journal-saved','journal-count','journal-empty','journal-reset'])fields[id]=new Element();
  const cards=data.articles.map(a=>{const card=new Element();card.dataset.articleId=a.id;card.status=new Element();card.querySelector=()=>card.status;return card;});
  const buttons=cards.map(card=>{const button=new Element();button.dataset.saveArticle=card.dataset.articleId;button.closest=()=>card;return button;});
  const library=new Element();library.querySelectorAll=()=>cards;
  const compare=new Element(),table=new Element(),status=new Element(),wrappers=data.journeys.map(()=>new Element());
  const head=new Element(),body=new Element();head.tag='thead';body.tag='tbody';table.append(head);table.append(body);
  compare.querySelector=selector=>selector==='table'?table:status;
  const choices=data.journeys.map(j=>{const choice=new Element();choice.dataset.compareTour=j.id;return choice;});
  doc.getElementById=id=>fields[id];
  doc.querySelector=selector=>selector==='[data-journal-library]'&&!compareMode?library:selector==='[data-journey-comparison]'&&compareMode?compare:null;
  doc.querySelectorAll=selector=>selector==='[data-save-article]'&&!compareMode?buttons:selector==='[data-compare-tour]'&&compareMode?choices:selector==='.journey-compare-choice'&&compareMode?wrappers:[];
  doc.createElement=tag=>{const element=new Element();element.tag=tag;return element;};
  const storage=new Map(),root=new Element();
  Object.assign(root,{document:doc,DavidJournalData:data,DavidTourData:tours,location:{search,href:'https://example.com/journal.html'+search},localStorage:{getItem:key=>{if(blocked)throw Error('storage blocked');return storage.get(key)||null;},setItem:(key,value)=>{if(blocked)throw Error('storage blocked');storage.set(key,value);}},history:{replaceState(_state,_title,url){root.lastURL=url;}}});
  vm.runInNewContext(code,{globalThis:root,URL,URLSearchParams});
  return {root,doc,fields,cards,buttons,choices,wrappers,table,status,storage};
}
test('a shared category URL initializes filters; saved-only results and reset stay usable',()=>{
  const f=fixture('?category=safari'),visible=()=>f.cards.filter(c=>!c.hidden);
  assert.equal(visible().length,data.articles.filter(a=>a.category==='safari').length);assert.equal(f.fields['journal-filters'].hidden,false);
  const card=f.cards.find(c=>c.dataset.articleId==='planning-serengeti-safari'),button=f.buttons.find(b=>b.dataset.saveArticle===card.dataset.articleId);
  button.fire('click');assert.equal(button.attrs['aria-pressed'],'true');
  f.fields['journal-saved'].checked=true;f.fields['journal-filters'].fire('change');assert.equal(visible().length,1);
  assert.equal(new URL(f.root.lastURL).searchParams.get('saved'),'1');
  button.fire('click');assert.equal(visible().length,0);assert.equal(f.fields['journal-empty'].hidden,false);assert.equal(f.fields['journal-saved'].focused,true);
  f.fields['journal-reset'].fire('click');assert.equal(visible().length,data.articles.length);assert.equal(f.fields['journal-empty'].hidden,true);
});
test('blocked storage preserves saved guides for the visit and gives an accurate status',()=>{
  const f=fixture('',true);f.buttons[0].fire('click');
  assert.equal(f.buttons[0].attrs['aria-pressed'],'true');assert.match(f.cards[0].status.textContent,/this visit/);
  f.fields['journal-saved'].checked=true;f.fields['journal-filters'].fire('input');
  assert.equal(f.cards.filter(c=>!c.hidden).length,1);
});
test('the comparison rejects a fourth choice, renders real night counts and restores all four',()=>{
  const f=fixture('',false,true);assert.ok(f.wrappers.every(w=>!w.hidden));
  for(const choice of f.choices.slice(0,3)){choice.checked=true;choice.fire('change');}
  assert.equal(f.table.querySelector('thead').children[0].children.length,4);
  const nights=f.table.querySelector('tbody').children[1];assert.equal(nights.children[1].textContent,'13 nights');assert.equal(nights.children[3].textContent,'8 nights');
  f.choices[3].checked=true;f.choices[3].fire('change');assert.equal(f.choices[3].checked,false);assert.match(f.status.textContent,/up to three/);
  for(const choice of f.choices.slice(0,3)){choice.checked=false;choice.fire('change');}
  assert.equal(f.table.querySelector('thead').children[0].children.length,5);assert.equal(f.status.textContent,'Showing all four special journeys.');
});
