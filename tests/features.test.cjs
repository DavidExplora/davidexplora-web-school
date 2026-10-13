'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {cleanSaved,readSaved,toggleSaved,quickPlan}=require('../features.js');
const {getTour,filterTours}=require('../packages.js');

test('saved tours reject stale or malicious ids and recover from invalid browser storage',()=>{
  assert.deepEqual(cleanSaved(['constructor','__proto__','2-day-mikumi-safari','2-day-mikumi-safari','missing']),['2-day-mikumi-safari']);
  assert.deepEqual(readSaved({getItem(){throw Error('storage blocked');}}),[]);
  assert.deepEqual(readSaved({getItem:()=>'{broken'}),[]);
  assert.deepEqual(readSaved({getItem:()=>'{}'}),[]);
  const once=toggleSaved([],'3-day-nyerere-road-safari');assert.deepEqual(once,['3-day-nyerere-road-safari']);
  assert.deepEqual(toggleSaved(once,'3-day-nyerere-road-safari'),[]);
});
test('exact durations combine with saved tours and price filters without inventing matches',()=>{
  const ids=['2-day-mikumi-safari','3-day-nyerere-road-safari','6-day-northern-safari-culture'];
  assert.deepEqual(filterTours({length:'2',savedIds:ids}).map(t=>t.id),['2-day-mikumi-safari']);
  assert.deepEqual(filterTours({length:'3',savedIds:ids,budget:1000}),[]);
  assert.deepEqual(filterTours({savedIds:[]}),[]);
  assert.ok(filterTours({length:'6'}).every(t=>t.days===6));
});
test('quick planner preserves an optional date while validating real dates and actual party sizes',()=>{
  const base={destination:'Zanzibar',travelers:'3',date:''};
  assert.deepEqual(quickPlan(base,'2026-10-13').errors,[]);
  assert.equal(quickPlan(base,'2026-10-13').travelers,3);
  for(const date of ['2026-02-30','2026-10-12','2026-13-01','2026-10-14x'])assert.ok(quickPlan({...base,date},'2026-10-13').errors.length);
  for(const travelers of ['0','1.5','51','NaN'])assert.ok(quickPlan({...base,travelers},'2026-10-13').errors.length);
  assert.ok(quickPlan({...base,destination:'constructor'},'2026-10-13').errors.length);
});
test('safari departures, flights and luxury routes have explicit operational boundaries',()=>{
  assert.match(getTour('3-day-nyerere-road-safari').start,/Dar es Salaam/);
  const flight=getTour('3-day-nyerere-fly-in-zanzibar');assert.match(flight.start,/Zanzibar/);assert.match(flight.includes.join(' '),/Return scheduled/);
  assert.equal(getTour('2-day-mikumi-safari').price,475);
  assert.equal(getTour('6-day-northern-safari-culture').price,null);
  assert.equal(getTour('4-day-luxury-northern-safari').price,null);
  const combined=getTour('6-day-drive-in-safari-zanzibar');assert.equal(combined.price,3400);assert.equal(combined.itinerary.length,6);assert.ok(!combined.places.includes('Ngorongoro'));
  assert.match(combined.includes.join(' '),/scheduled mainland-to-Zanzibar flight/);
});
