'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPlan, createInquiry, presets, destinations, durations, interests } = require('../journey.js');
const valid = {name:'Ana García',email:'ana@example.com',whatsapp:'+34 612 345 678',date:'2027-02-01',travelers:2,destination:'Safari',duration:'5–7 days',style:'Private journey',language:'Spanish',message:'Wildlife & local coffee.\nBudget: to discuss.',consent:true};

test('all 80 planner combinations give a usable starting point and exact form values', () => {
  let count=0;
  for(const destination of Object.keys(destinations)) for(const interest of Object.keys(interests)) for(const duration of Object.keys(durations)) {
    const plan=buildPlan({destination,interest,duration});
    assert.ok(plan.title && plan.summary && plan.note && plan.message);
    assert.equal(plan.steps.length,3);
    assert.equal(plan.destination,destinations[destination]);
    assert.equal(plan.duration,durations[duration]);
    assert.match(plan.link,/\.html$/);
    count++;
  }
  assert.equal(count,80);
});
test('short mountain visit explains the day-hike limit and longer visits allow transfer days',()=>{
  for(const interest of Object.keys(interests)) {
    const short=buildPlan({destination:'kilimanjaro',interest,duration:'3-4'});
    assert.match(short.note,/too short for the summit/);
    assert.ok(short.steps.every(step=>!step.includes('summit')));
    const week=buildPlan({destination:'kilimanjaro',interest,duration:'5-7'});
    assert.match(week.note,/arrival and departure/);
    assert.match(week.note,/may be too short/);
  }
});
test('invalid and inherited planner keys never produce a plan',()=>{
  assert.equal(buildPlan(),null);
  for(const key of ['constructor','__proto__','unknown','']) assert.equal(buildPlan({destination:key,interest:'mixed',duration:'3-4'}),null);
});
test('WhatsApp message preserves Unicode, line breaks and URL-sensitive characters safely',()=>{
  const data={...valid,message:'<script>alert("hello")</script>\nFish & chips? + 50% / café 😊'};
  const result=createInquiry(data,'2026-10-10');
  assert.deepEqual(result.errors,[]);
  const url=new URL(result.url);
  assert.equal(url.hostname,'wa.me');
  assert.equal(url.pathname,'/255778321400');
  assert.equal(url.searchParams.get('text'),result.text);
  assert.ok(result.text.includes(data.message));
  assert.ok(result.text.includes('Ana García'));
  assert.match(result.text,/inclusions and exclusions/);
});
test('a request needs consent, a valid email, whole travelers and real nonpast dates',()=>{
  for(const patch of [{consent:false},{name:'  '},{email:'bad-email'},{email:'ana@example.com\nBcc: other'},{travelers:0},{travelers:51},{travelers:1.5},{date:'2027-02-30'},{date:'2026-10-09'},{destination:'Unknown'},{duration:'3-4 days'},{whatsapp:'call me later'}]) {
    const result=createInquiry({...valid,...patch},'2026-10-10');
    assert.ok(result.errors.length,JSON.stringify(patch));
    assert.equal(result.url,'');
    assert.equal(result.text,'');
  }
});
test('optional phone, date and message produce an honest flexible request',()=>{
  const result=createInquiry({...valid,whatsapp:'',date:'',message:'',duration:'Flexible'},'2026-10-10');
  assert.deepEqual(result.errors,[]);
  assert.match(result.text,/Flexible \/ to discuss/);
  assert.match(result.text,/Contact me here or by email/);
});
test('route presets fit the arrival/departure buffers and unknown content is never a preset',()=>{
  for(const key of ['machame','lemosho','marangu']) {
    assert.equal(presets[key][0],'Kilimanjaro');
    assert.equal(presets[key][1],'8–10 days');
    assert.match(presets[key][2],/arrival and departure/);
  }
  assert.equal(Object.hasOwn(presets,'constructor'),false);
});
