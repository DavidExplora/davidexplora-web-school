'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {tours,filterTours,getTour,requestPreset} = require('../packages.js');
const {createInquiry} = require('../journey.js');
const valid = {name:'Ana García',email:'ana@example.com',travelers:2,date:'2027-02-01',consent:true,language:'Spanish'};

test('the catalogue has complete, unique itineraries with honest price bases',()=>{
  assert.equal(tours.length,42);
  assert.equal(new Set(tours.map(t=>t.id)).size,tours.length);
  for (const tour of tours) {
    assert.ok(tour.itinerary.length && tour.includes.length && tour.excludes.length && tour.notes);
    assert.ok(tour.basis && tour.group >= 2 && tour.tripDays >= tour.days);
    assert.ok(tour.price === null || (Number.isFinite(tour.price) && tour.price > 0));
    if (tour.price2 !== null) assert.ok(tour.price2 >= tour.price);
  }
});
test('affordable filters exclude unpriced trips rather than suggesting they are free',()=>{
  const result=filterTours({budget:100});
  assert.ok(result.length >= 5);
  assert.ok(result.every(t=>t.price !== null && t.price <= 100));
  assert.ok(result.some(t=>t.id==='stone-town-walking-tour'));
  assert.ok(!result.some(t=>t.id==='luxury-northern-safari'));
  assert.ok(filterTours({}).some(t=>t.id==='luxury-northern-safari'));
});
test('destination, duration, price and case-insensitive search combine coherently',()=>{
  assert.deepEqual(filterTours({category:'safari',length:'short',budget:1000}).map(t=>t.id),['2-day-tarangire-ngorongoro','2-day-mikumi-safari']);
  assert.deepEqual(filterTours({query:'  MACHAME  ',category:'trekking'}).map(t=>t.id),['7-day-machame-trek','9-day-mens-kilimanjaro-journey','christmas-machame-group']);
  assert.equal(filterTours({query:'Serengeti',category:'zanzibar'}).length,0);
  assert.ok(filterTours({length:'day'}).every(t=>t.days===1));
});
test('every package can prepare an encoded inquiry for its actual trip length',()=>{
  for (const tour of tours) {
    const preset=requestPreset(tour.id);
    const result=createInquiry({...valid,...preset,budget:'1500',message:preset.message},'2026-10-11');
    assert.deepEqual(result.errors,[],tour.id);
    assert.ok(result.text.includes(tour.title));
    assert.match(result.text,/Budget per adult: USD 1,500/);
    assert.match(result.text,/booking terms/);
    assert.equal(new URL(result.url).searchParams.get('text'),result.text);
  }
});
test('mountain requests include arrival and departure instead of compressing summit routes',()=>{
  for (const id of ['6-day-marangu-trek','7-day-machame-trek','8-day-lemosho-trek']) {
    assert.equal(getTour(id).tripDays,getTour(id).days+2);
    assert.equal(requestPreset(id).duration,'8–10 days');
  }
  assert.equal(requestPreset('kilimanjaro-marangu-day-hike').duration,'1–2 days');
  assert.match(getTour('kilimanjaro-marangu-day-hike').summary,/not a summit/);
});
test('an actual couple can request a four-person guide itinerary without an assumed fixed price',()=>{
  const preset=requestPreset('4-day-serengeti-camping');
  const result=createInquiry({...valid,...preset,travelers:2},'2026-10-11');
  assert.match(result.text,/Travellers: 2/);
  assert.match(result.text,/based on 4 adults/);
  assert.match(result.text,/confirm the price for my actual group and dates/);
  assert.equal(getTour('4-day-serengeti-camping').price2,1550);
});
test('unknown URL keys never select a package and tailored trips never invent a numeric offer',()=>{
  for (const id of ['constructor','__proto__','missing',null]) {
    assert.equal(getTour(id),null);assert.equal(requestPreset(id),null);
  }
  assert.equal(getTour('luxury-northern-safari').price,null);
  assert.match(requestPreset('luxury-northern-safari').message,/personal quote/);
  assert.ok(!requestPreset('luxury-northern-safari').message.includes('USD 0'));
});
test('optional budgets are validated and package names cannot insert message headers',()=>{
  const base={...valid,destination:'Safari',duration:'5–7 days'};
  for (const budget of ['-5','0','1.5','NaN','Infinity','1000001','250\nDestination: other']) {
    const result=createInquiry({...base,budget},'2026-10-11');
    assert.ok(result.errors.length);assert.equal(result.url,'');
  }
  const result=createInquiry({...base,budget:'',package:'Trip\nEmail: injected\u0000'},'2026-10-11');
  assert.deepEqual(result.errors,[]);
  assert.match(result.text,/Budget per adult: To discuss/);
  assert.ok(!result.text.includes('\nEmail: injected'));
});
