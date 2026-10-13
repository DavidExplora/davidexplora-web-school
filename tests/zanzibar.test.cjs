'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {tours,getTour,requestPreset}=require('../packages.js');
const costs=require('../data/zanzibar-costs.json');
const credits=require('../data/photo-credits.json');

test('Zanzibar departures and equipment have distinct, explicit price bases',()=>{
  assert.equal(tours.filter(t=>t.category==='zanzibar').length,14);
  assert.match(getTour('nakupenda-sandbank').start,/Stone Town/);
  assert.match(getTour('blue-lagoon-snorkeling').start,/Michamvi/);
  assert.match(getTour('mnemba-waters-snorkeling').start,/Matemwe/);
  assert.match(getTour('zanzibar-spice-farm').excludes.join(' '),/transfers/i);
  assert.match(getTour('zanzibar-mangrove-kayaking').notes,/standard kayak/);
  assert.match(getTour('zanzibar-jet-ski').basis,/30-minute/);
  assert.match(getTour('zanzibar-discover-scuba').includes.join(' '),/one ocean dive/);
  assert.match(getTour('kizimkazi-dolphin-watching').notes,/not swimming with dolphins/);
});
test('six-day island request includes five nights without implying resort or flight inclusions',()=>{
  const t=getTour('6-day-zanzibar-island-escape');
  assert.equal(t.itinerary.length,6);assert.equal(t.tripDays,6);
  assert.match(t.includes.join(' '),/5 guesthouse nights/);
  assert.match(t.basis,/off-peak/);assert.match(t.excludes.join(' '),/Flights/);
  assert.equal(requestPreset(t.id).destination,'Zanzibar');
  assert.equal(requestPreset(t.id).duration,'5–7 days');
});
test('modeled direct contribution is tested against stated groups and unverified cost assumptions',()=>{
  assert.match(costs.status,/not verified supplier rates/);
  for(const [id,model] of Object.entries(costs.models)){
    const t=getTour(id),expense=Object.entries(model).filter(([k])=>k!=='group').reduce((s,[,n])=>s+n,0),revenue=t.price*model.group;
    assert.equal(t.group,model.group,id);
    assert.ok((revenue-expense)/revenue>=costs.minimum_modeled_margin,id);
  }
});
test('licensed Zanzibar galleries retain source credits and explicit illustrative captions',()=>{
  for(const t of tours.filter(t=>t.category==='zanzibar'&&t.gallery)){
    assert.ok(t.gallery.length>=2,t.id);
    for(const p of t.gallery){assert.ok(fs.existsSync(p.image));assert.ok(p.caption&&p.alt);if(p.image.startsWith('images/zanzibar-tours/')){const c=credits.find(c=>c.file===p.image);assert.ok(c?.source_url&&c?.author);assert.match(c.license,/^CC BY/);}}
  }
  assert.match(getTour('kuza-cave').gallery[0].caption,/not a photograph inside the cave/);
  assert.match(getTour('zanzibar-mangrove-kayaking').gallery[1].caption,/Florida/);
  assert.match(getTour('zanzibar-jet-ski').imageNote,/illustration/);
});
