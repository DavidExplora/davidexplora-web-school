/* Exercise carousel event behavior in a small DOM fixture; no browser dependency. */
'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const code=fs.readFileSync(require.resolve('../experience.js'),'utf8');
class Element {
  constructor(text='') {
    this.textContent=text;this.attrs={};this.listeners={};this.dataset={};
    this.classes=new Set();this.classList={toggle:(key,on)=>on?this.classes.add(key):this.classes.delete(key)};
  }
  addEventListener(type,callback){(this.listeners[type]??=[]).push(callback);}
  fire(type,event={}){for(const callback of this.listeners[type]??[])callback({target:this,...event});}
  setAttribute(name,value){this.attrs[name]=value;}
  closest(){return null;}
}
function fixture(reduced=false, withVideo=false, saveData=false, background=false, seconds=[]) {
  const root=new Element(),document=new Element(),media=new Element();
  root.dataset.backgroundStory=String(background);
  media.matches=reduced;document.hidden=false;
  const controls=new Element(),pause=new Element(),counter=new Element(),announcement=new Element();
  const previous=new Element(),next=new Element();
  const slides=Array.from({length:3},(_,i)=>{const e=new Element();e.querySelector=()=>new Element('Chapter '+(i+1));return e;});
  slides.forEach((slide,n)=>{slide.dataset.sceneSeconds=seconds[n];});
  const mediaElements=Array.from({length:typeof withVideo==='number'?withVideo:1},(_,i)=>{
    const video=new Element();video.dataset.src=i===0?'media/serengeti-lion-cubs.mp4':'media/chapter-'+i+'.mp4';video.getAttribute=name=>name==='src'?video.src:null;video.playing=false;video.play=()=>{video.playing=true;return {catch(){}};};video.pause=()=>{video.playing=false;};return video;
  });
  const video=mediaElements[0],videos=withVideo?mediaElements:[];slides.forEach((slide,n)=>{slide.contains=element=>element===videos[n];});
  const dots=slides.map((_,i)=>{const e=new Element();e.dataset.slideTo=String(i);return e;});
  const map={'.story-controls':controls,'[data-pause]':pause,'[data-counter]':counter,'[data-announcement]':announcement,'[data-prev]':previous,'[data-next]':next};
  root.querySelector=selector=>map[selector];
  root.querySelectorAll=selector=>selector==='[data-slide]'?slides:selector==='[data-slide-to]'?dots:selector==='video[data-motion-video]'?videos:[];
  root.contains=element=>[...Object.values(map),...slides,...dots].includes(element);
  document.querySelectorAll=selector=>selector==='[data-carousel]'?[root]:[];
  document.querySelector=()=>null;
  const timers=new Map(),delays=new Map();let timerId=0,observer;
  class IntersectionObserver {constructor(callback){observer=callback;}observe(){}}
  const window={navigator:{connection:{saveData}},matchMedia:()=>media,setInterval:(callback,delay)=>{timers.set(++timerId,callback);delays.set(timerId,delay);return timerId;},clearInterval:id=>{timers.delete(id);delays.delete(id);},IntersectionObserver};
  vm.runInNewContext(code,{window,document,IntersectionObserver,URLSearchParams});
  const visible=value=>observer([{isIntersecting:value}]);
  return {root,document,media,controls,pause,counter,announcement,previous,next,slides,dots,timers,delays,visible,video,videos};
}
test('stories rotate only while visible and stop in a background tab',()=>{
  const f=fixture();assert.equal(f.timers.size,0);
  f.visible(true);assert.equal(f.timers.size,1);
  [...f.timers.values()][0]();assert.equal(f.counter.textContent,'02 / 03');
  f.document.hidden=true;f.document.fire('visibilitychange');assert.equal(f.timers.size,0);
  f.document.hidden=false;f.document.fire('visibilitychange');assert.equal(f.timers.size,1);
  f.visible(false);assert.equal(f.timers.size,0);
});
test('manual navigation wraps, announces the chapter and keeps hidden slides out of focus',()=>{
  const f=fixture();f.previous.fire('click');
  assert.equal(f.counter.textContent,'03 / 03');assert.equal(f.announcement.textContent,'Chapter 3');
  assert.equal(f.slides[2].attrs['aria-hidden'],'false');assert.equal(f.slides[2].inert,false);
  assert.ok(f.slides.slice(0,2).every(s=>s.attrs['aria-hidden']==='true' && s.inert));
  f.next.fire('click');assert.equal(f.counter.textContent,'01 / 03');
  f.dots[1].fire('click');assert.equal(f.counter.textContent,'02 / 03');
  assert.equal(f.dots[1].attrs['aria-pressed'],'true');
});
test('pause is persistent; explicit play can resume while the control remains focused',()=>{
  const f=fixture();f.visible(true);
  f.pause.fire('click');assert.equal(f.timers.size,0);assert.equal(f.pause.textContent,'Play story');
  f.root.fire('mouseleave');assert.equal(f.timers.size,0);
  f.root.fire('focusin');f.pause.fire('click');
  assert.equal(f.timers.size,1);assert.equal(f.pause.textContent,'Pause story');
  f.root.fire('mouseenter');assert.equal(f.timers.size,0);
});
test('reduced motion prevents autoplay while next, previous and keyboard remain usable',()=>{
  const f=fixture(true);f.visible(true);
  assert.equal(f.timers.size,0);assert.equal(f.pause.disabled,true);assert.equal(f.pause.textContent,'Motion off');
  f.next.fire('click');assert.equal(f.counter.textContent,'02 / 03');
  let prevented=false;f.root.fire('keydown',{key:'ArrowRight',preventDefault:()=>{prevented=true;}});
  assert.equal(prevented,true);assert.equal(f.counter.textContent,'03 / 03');assert.equal(f.timers.size,0);
});

test('keyboard focus pauses photos until the visitor explicitly resumes',()=>{
  const f=fixture();f.visible(true);
  f.root.fire('focusin');assert.equal(f.timers.size,0);
  f.root.fire('focusout',{relatedTarget:null});assert.equal(f.timers.size,0);
  f.pause.fire('click');assert.equal(f.timers.size,1);
});

test('a horizontal touch swipe changes the photo and pauses autoplay',()=>{
  const f=fixture();f.visible(true);
  f.root.fire('touchstart',{target:{closest:()=>null},touches:[{clientX:220,clientY:100}]});
  f.root.fire('touchend',{changedTouches:[{clientX:100,clientY:105}]});
  assert.equal(f.counter.textContent,'02 / 03');assert.equal(f.timers.size,0);
});
test('film playback loads only on an active visible slide and pauses with the story',()=>{
  const f=fixture(false,true);assert.equal(f.video.src,undefined);
  f.visible(true);assert.equal(f.video.src,'media/serengeti-lion-cubs.mp4');assert.equal(f.video.playing,true);
  f.pause.fire('click');assert.equal(f.video.playing,false);
  f.pause.fire('click');assert.equal(f.video.playing,true);
  f.next.fire('click');assert.equal(f.video.playing,false);
  f.previous.fire('click');assert.equal(f.video.playing,true);
  f.document.hidden=true;f.document.fire('visibilitychange');assert.equal(f.video.playing,false);
});
test('motion and data saving preferences keep the hero poster without downloading film',()=>{
  for(const f of [fixture(true,true),fixture(false,true,true)]){f.visible(true);assert.equal(f.video.src,undefined);assert.equal(f.video.playing,false);}
});
test('the background story keeps playing on pointer hover but its pause button works on the first focused click',()=>{
  const f=fixture(false,true,false,true);f.visible(true);
  f.root.fire('mouseenter');assert.equal(f.video.playing,true);assert.equal(f.timers.size,1);
  f.root.fire('focusin',{target:f.pause});f.pause.fire('click');
  assert.equal(f.video.playing,false);assert.equal(f.pause.textContent,'Play story');
  f.pause.fire('click');assert.equal(f.video.playing,true);
});
test('mixed film chapters load one at a time and use their individual scene timings',()=>{
  const f=fixture(false,3,false,true,[12,10,10]);f.visible(true);
  assert.deepEqual(f.videos.map(v=>v.playing),[true,false,false]);
  assert.equal(f.videos[1].src,undefined);assert.equal([...f.delays.values()][0],12000);
  [...f.timers.values()][0]();assert.deepEqual(f.videos.map(v=>v.playing),[false,true,false]);
  assert.equal([...f.delays.values()][0],10000);assert.equal(f.videos[2].src,undefined);
  [...f.timers.values()][0]();assert.deepEqual(f.videos.map(v=>v.playing),[false,false,true]);
  f.visible(false);assert.ok(f.videos.every(v=>!v.playing));
});
