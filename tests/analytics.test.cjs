'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const analytics = require('../analytics.js');
const id = 'G-BD611F1Z0K';

function fixture({choice, age = 0, enabled = true, blocked = false, href = 'https://davidexplora.com/?utm_source=instagram&utm_campaign=marangu_oct2026&email=guest%40example.com#private'} = {}) {
  let time = 1000000000;
  const storage = new Map();
  if (choice) storage.set(analytics.key, JSON.stringify({choice,time:time-age}));
  const handlers = {}, writes = [], created = [];
  const element = tag => ({tagName:tag, children:[], events:{},hidden:false,
    appendChild(child){this.children.push(child);return child;},setAttribute(){},
    addEventListener(name,fn){this.events[name]=fn;},focus(){doc.activeElement=this;},
    contains(child){return Object.values(this.controls || {}).includes(child);},
    querySelector(selector){this.controls=this.controls || {};return this.controls[selector] ||= element('button');}});
  const doc = {title:'Marangu Village & Coffee | David Explora', referrer:'https://www.google.com/search?q=private+query',
    head:element('head'),body:element('body'),footer:element('div'),activeElement:null,
    createElement(tag){const el=element(tag);created.push(el);return el;},
    querySelector(){return this.footer;},addEventListener(name,fn){handlers[name]=fn;}};
  Object.defineProperty(doc,'cookie',{get:()=> '_ga=old; _ga_BD611F1Z0K=old; david_saved_tours=keep',set:value=>writes.push(value)});
  const url = new URL(href);
  const root={location:{protocol:url.protocol,hostname:url.hostname,href:url.href,reload(){root.reloaded=true;}},Date:{now:()=>time},
    addEventListener(name,fn){handlers['root:'+name]=fn;}};
  if(blocked) Object.defineProperty(root,'localStorage',{get(){throw new Error('blocked');}});
  else root.localStorage={getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)};
  const state=analytics.install(root,doc,{measurementId:id,enabled});
  const commands=()=> (root.dataLayer || []).map(args=>Array.from(args));
  const eventCommands=()=>commands().filter(args=>args[0]==='event');
  return {root,doc,state,storage,writes,created,handlers,commands,eventCommands,advance(ms){time+=ms;}};
}

test('a disabled configuration never initializes Analytics', () => {
  assert.equal(analytics.settings.measurementId,id);
  const f=fixture({enabled:false});
  assert.equal(f.state.installed,false);
  assert.equal(f.doc.head.children.length,0);
  assert.equal(f.doc.body.children.length,0);
  assert.equal(f.commands().length,0);
});

test('no Google script or events are emitted before consent or after an initial decline', () => {
  const f=fixture();
  assert.equal(f.doc.head.children.length,0);
  assert.equal(f.eventCommands().length,0);
  assert.deepEqual(f.commands()[0].slice(0,2),['consent','default']);
  f.state.choose('denied');
  assert.equal(f.doc.head.children.length,0);
  assert.equal(f.state.track('contact_click','whatsapp'),false);
  assert.equal(f.eventCommands().length,0);
});

test('a positive visitor choice loads one tag, queues one page view and keeps advertising denied', () => {
  const f=fixture();
  f.state.choose('granted');f.state.choose('granted');
  assert.equal(f.doc.head.children.length,1);
  assert.equal(f.doc.head.children[0].src,'https://www.googletagmanager.com/gtag/js?id='+id);
  assert.equal(f.eventCommands().filter(args=>args[1]==='page_view').length,1);
  const consent=f.commands().find(args=>args[0]==='consent'&&args[1]==='update')[2];
  assert.equal(consent.analytics_storage,'granted');
  for(const name of ['ad_storage','ad_user_data','ad_personalization']) assert.equal(consent[name],'denied');
  const config=f.commands().find(args=>args[0]==='config')[2];
  assert.equal(config.send_page_view,false);
  assert.equal(config.allow_google_signals,false);
  assert.equal(config.allow_ad_personalization_signals,false);
  assert.doesNotMatch(JSON.stringify(f.commands()),/guest|example|private/);
});

test('contact events exclude the complete WhatsApp and email draft URLs', () => {
  const f=fixture({choice:'granted'});
  for(const href of ['https://wa.me/255778321400?text=Name%3A%20Ana%20Email%3A%20ana%40example.com','mailto:info@davidexplora.com?body=Ana%20private%20request']) {
    f.handlers.click({target:{closest:()=>({href})}});
  }
  const events=f.eventCommands().filter(args=>args[1]==='contact_click');
  assert.deepEqual(events.map(args=>args[2].contact_method),['whatsapp','email']);
  assert.doesNotMatch(JSON.stringify(f.commands()),/Ana|ana@|255778|mailto:|wa\.me|private/);
});

test('enquiry events distinguish an actual native POST handoff from invalid forms and prepared drafts', () => {
  const f=fixture({choice:'granted'});
  f.handlers.submit({target:{id:'trip-inquiry-form'},defaultPrevented:true});
  f.handlers.submit({target:{id:'other-form'},defaultPrevented:false});
  assert.equal(f.eventCommands().filter(args=>args[1]==='enquiry_submit').length,0);
  f.handlers.submit({target:{id:'trip-inquiry-form'},defaultPrevented:false});
  assert.equal(f.eventCommands().filter(args=>args[1]==='enquiry_submit').length,1);
});

test('withdrawal blocks events, clears Analytics cookies only, and reloads to remove the loaded tag', () => {
  const f=fixture({choice:'granted'});
  f.state.choose('denied');
  assert.equal(f.root['ga-disable-'+id],true);
  assert.equal(f.state.track('contact_click','email'),false);
  assert.equal(f.root.reloaded,true);
  assert.ok(f.writes.some(x=>x.startsWith('_ga=')));
  assert.ok(f.writes.some(x=>x.startsWith('_ga_BD611F1Z0K=')));
  assert.ok(f.writes.every(x=>!x.includes('david_saved_tours')));
  assert.equal(JSON.parse(f.storage.get(analytics.key)).choice,'denied');
});

test('a denied stored choice, expired choice and blocked storage all begin without collection', () => {
  const denied=fixture({choice:'denied'});assert.equal(denied.doc.head.children.length,0);
  const old=fixture({choice:'granted',age:analytics.lifetime});assert.equal(old.doc.head.children.length,0);
  const blocked=fixture({blocked:true});assert.equal(blocked.doc.head.children.length,0);
  blocked.state.choose('granted');assert.equal(blocked.doc.head.children.length,1);
  const expired=fixture({choice:'granted'});
  expired.advance(analytics.lifetime);
  expired.handlers['root:storage']({key:analytics.key});
  assert.equal(expired.root.reloaded,true);
});

test('consent controls can be reopened with keyboard focus and Escape leaves collection off', () => {
  const f=fixture();
  const panel=f.doc.body.children[0],button=f.doc.footer.children[0];
  button.events.click();assert.equal(panel.hidden,false);
  panel.events.keydown({key:'Escape'});
  assert.equal(panel.hidden,true);assert.equal(f.doc.activeElement,button);
  assert.equal(f.doc.head.children.length,0);
});

test('local previews and lookalike hosts never load the production Analytics tag', () => {
  for(const href of ['http://localhost:4173/','https://davidexplora.com.example.org/','file:///index.html']) {
    const f=fixture({href});assert.equal(f.state.installed,false);assert.equal(f.doc.head.children.length,0);
  }
});
