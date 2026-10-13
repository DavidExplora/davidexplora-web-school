'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {setupNavigation}=require('../features.js');

class Element {
  constructor(){this.listeners={};this.open=false;}
  addEventListener(type,callback){(this.listeners[type]??=[]).push(callback);}
  fire(type,event={}){for(const callback of this.listeners[type]??[])callback({target:this,...event});}
  closest(){return null;}
}
function fixture(desktop=true) {
  const document=new Element(),media=new Element(),nav=new Element();media.matches=desktop;
  const groups=Array.from({length:3},()=>{
    const group=new Element();group.summary=new Element();group.link=new Element();
    group.contains=element=>[group,group.summary,group.link].includes(element);
    group.summary.focus=()=>{document.activeElement=group.summary;};
    group.querySelector=()=>group.summary;return group;
  });
  nav.contains=element=>groups.some(g=>g.contains(element));
  let id=0;const timers=new Map();
  const env={document,matchMedia:()=>media,setTimeout:callback=>{timers.set(++id,callback);return id;},clearTimeout:id=>timers.delete(id)};
  setupNavigation(nav,groups,env);
  function tick(){const callbacks=[...timers.values()];timers.clear();callbacks.forEach(fn=>fn());}
  return {document,media,nav,groups,timers,tick};
}
test('desktop hover opens one menu and lets the pointer cross into its panel',()=>{
  const f=fixture(),[safari,mountain]=f.groups;
  safari.fire('pointerenter',{pointerType:'mouse'});assert.equal(safari.open,true);
  safari.fire('pointerleave');assert.equal(safari.open,true);assert.equal(f.timers.size,1);
  safari.fire('pointerenter',{pointerType:'mouse'});f.tick();assert.equal(safari.open,true);
  mountain.fire('pointerenter',{pointerType:'mouse'});assert.equal(mountain.open,true);assert.equal(safari.open,false);
  mountain.fire('pointerleave');f.tick();assert.equal(mountain.open,false);
});
test('Escape dismisses a hovered menu and returns focus without reopening it',()=>{
  const f=fixture(),[group]=f.groups;group.fire('pointerenter',{pointerType:'mouse'});
  let stopped=false;group.fire('keydown',{key:'Escape',stopPropagation:()=>{stopped=true;}});
  assert.equal(group.open,false);assert.equal(stopped,true);assert.equal(f.document.activeElement,group.summary);
  group.fire('pointerenter',{pointerType:'mouse'});assert.equal(group.open,false);
  group.fire('pointerleave');group.fire('pointerenter',{pointerType:'mouse'});assert.equal(group.open,true);
});
test('keyboard focus keeps links available after the pointer leaves',()=>{
  const f=fixture(),[group]=f.groups;group.fire('pointerenter',{pointerType:'mouse'});
  f.document.activeElement=group.link;group.fire('pointerleave');f.tick();assert.equal(group.open,true);
  f.document.activeElement=null;group.fire('focusout',{relatedTarget:null});f.tick();assert.equal(group.open,false);
});
test('touch and small screens retain native click disclosures and single-menu behaviour',()=>{
  for(const f of [fixture(false),fixture(true)]){
    const [first,second]=f.groups;first.fire('pointerenter',{pointerType:'touch'});assert.equal(first.open,false);
    if(!f.media.matches){first.fire('pointerenter',{pointerType:'mouse'});assert.equal(first.open,false);}
    first.open=true;first.fire('toggle');second.open=true;second.fire('toggle');
    assert.equal(first.open,false);assert.equal(second.open,true);
  }
});
test('outside clicks, navigation links and a layout change close open menus',()=>{
  const f=fixture(),[group]=f.groups;
  group.fire('pointerenter');f.document.fire('click',{target:new Element()});assert.equal(group.open,false);
  group.fire('pointerleave');group.fire('pointerenter');
  f.document.fire('click',{target:{closest:()=>true}});assert.equal(group.open,false);
  group.fire('pointerleave');group.fire('pointerenter');f.media.matches=false;f.media.fire('change');
  assert.equal(group.open,false);assert.equal(f.timers.size,0);
});
