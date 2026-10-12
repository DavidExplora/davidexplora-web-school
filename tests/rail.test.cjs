const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function fixture(reduced=false) {
  const element = () => ({events:{},addEventListener(name,fn){this.events[name]=fn;},fire(name,event={}){this.events[name]?.(event);}});
  const track = Object.assign(element(), {scrollLeft:0,clientWidth:900,scrollWidth:1900,getBoundingClientRect:()=>({left:0}),scrollTo(options){this.scrollLeft=options.left;this.behavior=options.behavior;this.fire('scroll');}});
  const cards=Array.from({length:6},(_,i)=>({getBoundingClientRect:()=>({left:i*320-track.scrollLeft,right:i*320+300-track.scrollLeft})}));
  track.querySelectorAll=()=>cards;
  const previous=element(),next=element(),position={},status={},buttons={hidden:true};
  const rail={querySelector:selector=>({'.tour-rail-track':track,'[data-rail-prev]':previous,'[data-rail-next]':next,'.rail-position':position,'[data-rail-status]':status,'.rail-buttons':buttons})[selector]};
  const document={querySelectorAll:selector=>selector==='[data-tour-rail]'?[rail]:[],querySelector:()=>null};
  const window={location:{pathname:'/index.html'},matchMedia:()=>({matches:reduced,addEventListener(){}}),addEventListener(){}};
  vm.runInNewContext(fs.readFileSync('ui.js','utf8'),{window,document});
  return {track,previous,next,position,buttons};
}
test('tour rail reveals controls and clamps navigation at both ends',()=>{
  const f=fixture();
  assert.equal(f.buttons.hidden,false);assert.equal(f.previous.disabled,true);
  f.next.fire('click');assert.equal(f.track.scrollLeft,320);assert.equal(f.previous.disabled,false);
  for(let i=0;i<5;i++)f.next.fire('click');
  assert.equal(f.track.scrollLeft,1000);assert.equal(f.next.disabled,true);
  for(let i=0;i<5;i++)f.previous.fire('click');
  assert.equal(f.track.scrollLeft,0);assert.equal(f.previous.disabled,true);
});
test('rail keyboard controls respect reduced motion and do not hijack card links',()=>{
  const f=fixture(true);let prevented=false;
  f.track.fire('keydown',{target:f.track,key:'End',preventDefault(){prevented=true;}});
  assert.equal(prevented,true);assert.equal(f.track.scrollLeft,1000);assert.equal(f.track.behavior,'auto');
  f.track.fire('keydown',{target:{},key:'ArrowLeft',preventDefault(){throw Error('A link key was intercepted');}});
  assert.equal(f.track.scrollLeft,1000);
  f.track.fire('keydown',{target:f.track,key:'Home',preventDefault(){}});
  assert.equal(f.track.scrollLeft,0);
});
