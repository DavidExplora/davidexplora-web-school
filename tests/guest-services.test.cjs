'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const api=require('../guest-services.js'),data=require('../guest-data.js'),tours=require('../tour-data.js');
const valid={name:'Ana García',email:'ana@example.com',locale:'es',date:'2026-12-19',party:2,destination:'safari',language:'Spanish',assistance:['boarding','steps'],notes:'Dos viajeros & una silla de ruedas.',consent:true};
const days=(from,to)=>(Date.parse(to)-Date.parse(from))/86400000;

test('December departures retain all route days, arrival nights and the correct Christmas summit objective',()=>{
  assert.equal(data.departures.length,3);
  for(const group of data.departures){
    const tour=tours.find(t=>t.id===group.id);
    assert.equal(group.status,'proposed');assert.equal(group.start,'2026-12-20');assert.equal(group.arrival,'2026-12-19');
    assert.equal(days(group.start,group.end)+1,tour.days);
    assert.equal(days(group.arrival,group.departure)+1,tour.tripDays);
    assert.equal(tour.itinerary.length,tour.tripDays);assert.equal(tour.nights,tour.tripDays-1);
    assert.equal(tour.price,null);assert.equal(tour.price2,null);
  }
  const [machame,lemosho]=data.departures;
  assert.equal(machame.summit,'2026-12-25');assert.equal(lemosho.summit,'2026-12-26');
  assert.equal(days(machame.start,machame.summit)+1,6);
  assert.equal(days(lemosho.start,lemosho.summit)+1,7);
});
test('past and underway departures cannot be presented as joinable future dates',()=>{
  const group=data.departures[0];
  assert.equal(api.departureState(group,'2026-10-14'),'proposed');
  assert.equal(api.departureState(group,'2026-12-20'),'underway');
  assert.equal(api.departureState(group,'2026-12-28'),'past');
  assert.equal(api.departureState(null,'2026-10-14'),'unavailable');
  assert.equal(api.validDate('2026-02-30'),false);
  assert.equal(api.todayInTanzania(new Date('2026-12-19T22:15:00Z')),'2026-12-20');
});
test('downloaded calendars are tentative, cover the full trip and use valid UTF-8 line folding',()=>{
  for(const group of data.departures){
    const bytes=fs.readFileSync('calendars/'+group.id+'.ics'),raw=bytes.toString('utf8'),text=raw.replace(/\r\n /g,'');
    assert.match(text,/STATUS:TENTATIVE/);assert.match(text,/not a booking/);assert.match(text,/TRANSP:TRANSPARENT/);
    assert.ok(text.includes('DTSTART;VALUE=DATE:'+group.arrival.replaceAll('-','')));
    const end=new Date(group.departure+'T12:00:00Z');end.setUTCDate(end.getUTCDate()+1);
    assert.ok(text.includes('DTEND;VALUE=DATE:'+end.toISOString().slice(0,10).replaceAll('-','')));
    assert.ok(raw.split('\r\n').every(line=>Buffer.byteLength(line,'utf8')<=75));
    assert.ok(!text.includes('ATTENDEE:'));assert.ok(!text.includes('METHOD:REQUEST'));
  }
});
test('Spanish assistance drafts preserve functional needs and encode both delivery links without claiming a booking',()=>{
  const result=api.createSupportRequest({...valid,assistance:['steps','steps','__proto__','boarding']},'2026-10-14');
  assert.equal(result.ok,true);assert.match(result.text,/Correo: ana@example.com/);assert.match(result.text,/habitación y baño sin escalones/);
  assert.match(result.text,/Dos viajeros & una silla de ruedas/);assert.match(result.text,/no es una reserva/);
  assert.equal(new URL(result.whatsapp).searchParams.get('text'),result.text);
  assert.equal(new URL(result.email).searchParams.get('body'),result.text);
  assert.equal(result.text.split('habitación y baño sin escalones').length,2);
});
test('support enquiries reject invalid contact, dates, party size and consent while keeping assistance voluntary',()=>{
  for(const change of [{email:'bad'},{date:'2026-02-30'},{date:'2026-10-01'},{party:1.5},{party:51},{destination:'__proto__'},{language:'unknown'},{consent:false}]){
    const result=api.createSupportRequest({...valid,...change},'2026-10-14');assert.equal(result.ok,false);assert.ok(result.errors.length);assert.equal(result.whatsapp,undefined);
  }
  const result=api.createSupportRequest({...valid,date:'',assistance:[],notes:'',locale:'en'},'2026-10-14');
  assert.equal(result.ok,true);assert.match(result.text,/Support to check: To discuss/);assert.match(result.text,/not a reservation/);
});
test('payment requests use a supplied quote reference and never imply a successful charge',()=>{
  const result=api.createPaymentRequest({name:'David & Ana',reference:'DE-2026/42',consent:true});
  assert.equal(result.ok,true);assert.match(result.text,/Quote reference: DE-2026\/42/);assert.match(result.text,/not a payment/);
  assert.equal(new URL(result.whatsapp).searchParams.get('text'),result.text);
  for(const reference of ['', 'x', 'DE-12\nBcc: other@example.com','x'.repeat(81)])assert.equal(api.createPaymentRequest({name:'Ana',reference,consent:true}).ok,false);
  const config=require('../data/payment-settings.json');assert.equal(config.cardCheckoutReady,false);assert.equal(config.mobileMoneyReady,false);assert.equal(config.hostedCheckoutUrl,null);
});

class Element{
  constructor(value=''){this.value=value;this.checked=false;this.hidden=false;this.events={};this.attrs={};this.dataset={};this.textContent='';}
  addEventListener(type,fn){(this.events[type]??=[]).push(fn);}
  fire(type,event={}){for(const fn of this.events[type]??[])fn({preventDefault(){},...event});}
  setAttribute(name,value){this.attrs[name]=value;}
  removeAttribute(name){delete this.attrs[name];delete this[name];}
  focus(){this.focused=true;}
}
const code=fs.readFileSync('guest-services.js','utf8');
function fixture({formMode=null,blocked=false,focusTag='BODY',search='',past=false}={}){
  const controls={},doc={activeElement:{tagName:focusTag},hidden:false},root={},storage=new Map(),timers=[];
  const welcome=new Element(),launcher=new Element(),close=new Element();welcome.hidden=true;welcome.contains=element=>element===close;controls['david-welcome']=welcome;controls['welcome-launch']=launcher;controls['welcome-close']=close;
  const form=new Element(),fields={};form.dataset={guestForm:formMode,locale:'es'};
  for(const name of ['name','email','date','party','destination','language','notes','reference','consent'])fields[name]=new Element(valid[name]??'');
  fields.consent.checked=true;
  const ready=new Element(),status=new Element(),preview=new Element(),whatsapp=new Element(),email=new Element(),submit=new Element();ready.hidden=true;submit.disabled=true;
  form.querySelector=selector=>selector.startsWith('[name="')?fields[selector.slice(7,-2)]:({'[data-guest-ready]':ready,'[data-guest-status]':status,'[data-guest-preview]':preview,'[data-guest-whatsapp]':whatsapp,'[data-guest-email]':email,'[type="submit"]':submit}[selector]||null);
  form.querySelectorAll=()=>valid.assistance.map(value=>new Element(value));
  const row=new Element(),rowStatus=new Element(),join=new Element(),calendar=new Element();row.dataset.departureId=data.departures[0].id;
  row.querySelector=()=>rowStatus;row.querySelectorAll=selector=>selector==='[data-join-departure]'?[join]:[calendar];
  doc.querySelector=()=>formMode?form:null;doc.querySelectorAll=selector=>selector==='[data-guest-form]'&&formMode?[form]:selector==='[data-departure-id]'&&past?[row]:[];doc.getElementById=id=>controls[id]||null;
  if(search){controls['trip-package']=new Element(data.departures[0].id);controls['travel-date']=new Element();controls['trip-style']=new Element();controls['trip-date-flexibility']=new Element();}
  Object.assign(root,{document:doc,DavidGuestData:data,location:{search,hash:''},innerHeight:900,setTimeout:fn=>timers.push(fn)});
  Object.defineProperty(root,'sessionStorage',{get(){if(blocked)throw Error('blocked');return {getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)};}});
  class Clock extends Date{constructor(...args){super(...(args.length?args:[past?'2027-01-01T00:00:00Z':'2026-10-14T00:00:00Z']));}}
  vm.runInNewContext(code,{globalThis:root,Date:Clock,Intl,URLSearchParams});
  return {controls,doc,root,timers,welcome,launcher,close,storage,form,fields,ready,status,preview,whatsapp,email,submit,rowStatus,join,calendar};
}
test('the real support form handler prepares drafts, focuses the review and clears stale links after editing',()=>{
  const f=fixture({formMode:'support'});assert.equal(f.submit.disabled,false);assert.equal(f.fields.date.min,'2026-10-14');
  f.form.fire('submit');assert.equal(f.ready.hidden,false);assert.equal(f.ready.focused,true);assert.match(f.preview.textContent,/Hola David/);
  assert.equal(new URL(f.whatsapp.href).searchParams.get('text'),f.preview.textContent);
  f.form.fire('input');assert.equal(f.ready.hidden,true);assert.equal(f.preview.textContent,'');assert.equal(f.whatsapp.href,undefined);
  f.fields.consent.checked=false;f.form.fire('submit');assert.equal(f.ready.hidden,true);assert.equal(f.fields.consent.focused,true);assert.match(f.status.textContent,/Acepta/);
});
test('the real payment form cannot produce a draft without a quote reference and clears it after changes',()=>{
  const f=fixture({formMode:'payment'});f.fields.reference.value='';f.form.fire('submit');assert.equal(f.ready.hidden,true);assert.equal(f.fields.reference.focused,true);
  f.fields.reference.value='DE-2026-42';f.form.fire('submit');assert.equal(f.ready.hidden,false);assert.match(f.preview.textContent,/verified payment instructions/);
  f.form.fire('change');assert.equal(f.email.href,undefined);assert.equal(f.ready.hidden,true);
});
test('welcome auto-opens without focus theft, dismisses for the visit and returns focus on Escape',()=>{
  const f=fixture();assert.equal(f.launcher.hidden,false);assert.equal(f.timers.length,1);f.timers[0]();
  assert.equal(f.welcome.hidden,false);assert.equal(f.launcher.focused,undefined);assert.equal(f.launcher.attrs['aria-expanded'],'true');
  f.doc.activeElement=f.close;f.welcome.fire('keydown',{key:'Escape'});assert.equal(f.welcome.hidden,true);assert.equal(f.launcher.focused,true);assert.equal(f.storage.get('david-welcome-dismissed'),'1');
  f.launcher.fire('click');assert.equal(f.welcome.hidden,false);
});
test('welcome stays quiet around forms, focused controls, hidden tabs and blocked storage but can open manually',()=>{
  const form=fixture({formMode:'support'});assert.equal(form.timers.length,0);
  const focused=fixture({focusTag:'INPUT'});focused.timers[0]();assert.equal(focused.welcome.hidden,true);
  const hidden=fixture();hidden.doc.hidden=true;hidden.timers[0]();assert.equal(hidden.welcome.hidden,true);
  const blocked=fixture({blocked:true});assert.equal(blocked.timers.length,0);blocked.launcher.fire('click');assert.equal(blocked.welcome.hidden,false);blocked.close.fire('click');assert.equal(blocked.welcome.hidden,true);
});
test('departure URLs prefill the arrival and group style while expired rows lose join and calendar links',()=>{
  const f=fixture({search:'?departure='+data.departures[0].id});assert.equal(f.controls['travel-date'].value,'2026-12-19');assert.equal(f.controls['trip-style'].value,'Small group, if available');assert.equal(f.controls['trip-date-flexibility'].value,'Exact dates');
  const expired=fixture({past:true});assert.match(expired.rowStatus.textContent,/Past proposed dates/);assert.equal(expired.join.href,'index.html#contact');assert.equal(expired.calendar.hidden,true);
});
