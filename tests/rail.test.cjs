const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function fixture(reduced=false, automatic=false) {
  const element = () => ({events:{},setAttribute(name,value){this[name]=value;},addEventListener(name,fn){this.events[name]=fn;},fire(name,event={}){this.events[name]?.(event);}});
  const track = Object.assign(element(), {scrollLeft:0,clientWidth:900,scrollWidth:1900,getBoundingClientRect:()=>({left:0}),scrollTo(options){this.scrollLeft=options.left;this.behavior=options.behavior;this.fire('scroll');}});
  const cards=Array.from({length:6},(_,i)=>({getBoundingClientRect:()=>({left:i*320-track.scrollLeft,right:i*320+300-track.scrollLeft})}));
  track.querySelectorAll=()=>cards;
  const previous=element(),next=element(),pause=element(),position={},status={},buttons={hidden:true};
  const rail=Object.assign(element(),{contains:target=>target===pause,querySelector:selector=>({'.tour-rail-track':track,'[data-rail-prev]':previous,'[data-rail-next]':next,'[data-rail-pause]':automatic?pause:null,'.rail-position':position,'[data-rail-status]':status,'.rail-buttons':buttons})[selector]});
  const document=Object.assign(element(),{hidden:false,querySelectorAll:selector=>selector==='[data-tour-rail]'?[rail]:[],querySelector:()=>null});
  let timer=null;
  const motion=Object.assign(element(),{matches:reduced});
  const window={location:{pathname:'/index.html'},matchMedia:query=>query.includes('prefers-reduced-motion')?motion:Object.assign(element(),{matches:false}),addEventListener(){},setInterval(fn){timer=fn;return 1;},clearInterval(){timer=null;}};
  vm.runInNewContext(fs.readFileSync('ui.js','utf8'),{window,document});
  return {track,previous,next,position,buttons,pause,rail,document,motion,tick(){timer?.();},running(){return Boolean(timer);}};
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
test('automatic rail wraps, pauses for interaction and stays quiet for screen readers',()=>{
  const f=fixture(false,true);assert.equal(f.running(),true);
  f.tick();assert.equal(f.track.scrollLeft,320);
  f.track.scrollLeft=1000;f.tick();assert.equal(f.track.scrollLeft,0);
  f.rail.fire('mouseenter');assert.equal(f.running(),false);
  f.rail.fire('mouseleave');assert.equal(f.running(),true);
  f.rail.fire('focusin');assert.equal(f.running(),false);
  f.pause.fire('click');assert.equal(f.running(),true); // explicit play can resume while focused
  f.next.fire('click');assert.equal(f.running(),false);
  f.pause.fire('click');f.track.fire('touchstart');assert.equal(f.running(),false);
});
test('automatic rail respects reduced motion and hidden tabs',()=>{
  const reduced=fixture(true,true);assert.equal(reduced.running(),false);assert.equal(reduced.pause.disabled,true);
  const f=fixture(false,true);f.document.hidden=true;f.document.fire('visibilitychange');assert.equal(f.running(),false);
  f.document.hidden=false;f.document.fire('visibilitychange');assert.equal(f.running(),true);
  f.motion.matches=true;f.motion.fire('change');assert.equal(f.running(),false);
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
