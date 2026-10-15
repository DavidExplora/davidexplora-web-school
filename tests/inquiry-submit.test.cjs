const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const journey = require('../journey.js');
const tours = require('../packages.js');

function fixture({campaign = '', referral = ''} = {}) {
  const element = (value = '') => ({value, hidden:true, events:{}, checked:false,
    addEventListener(name, fn){this.events[name] = fn;},
    scrollIntoView(){this.revealed = true;}, focus(){this.focused = true;},
    setAttribute(){}, classList:{add(){}}});
  const values = {'customer-name':'Ana García', 'customer-email':'ana@example.com',
    'customer-whatsapp':'', 'travel-date':'2027-02-01', 'traveler-count':'4',
    'trip-arrival':'Moshi / café & hotel', 'trip-date-flexibility':'Within a few days',
    'trip-package':'marangu-village-tour', 'trip-budget':'100',
    'trip-destination':'Local Tanzania', 'trip-duration':'1–2 days',
    'trip-style':'Private journey', 'trip-language':'English',
    'trip-message':'Two adults and two children aged 9 and 12. Vegetarian lunch, please.',
    'referral-source':referral, 'inquiry-campaign':''};
  const fields = Object.fromEntries(Object.entries(values).map(([id,value]) => [id,element(value)]));
  for(const id of ['inquiry-status','inquiry-ready','inquiry-preview','inquiry-whatsapp',
    'inquiry-email','inquiry-message','prepare-whatsapp','copy-status','copy-inquiry','privacy-consent','contact']) fields[id] = element();
  fields['privacy-consent'].checked = true;
  const submit = element(), form = element();
  form.querySelector = () => submit; form.reportValidity = () => true;
  fields['trip-inquiry-form'] = form;
  const document = {body:element(), querySelectorAll:() => [],
    querySelector:selector => fields[selector.slice(1)] || null,
    getElementById:id => fields[id], addEventListener(){}};
  const window = {DavidJourney:journey, DavidTours:tours, DavidLeadSource:{describe:()=>campaign}, location:{search:''},
    matchMedia:() => ({matches:false})};
  vm.runInNewContext(fs.readFileSync('script.js','utf8'), {window,document,Date});
  return {fields,form,values,submit(id){let prevented=false;form.events.submit({submitter:id?{id}:undefined,preventDefault(){prevented=true;}});return prevented;}};
}

test('the main enquiry permits the native email POST with the complete validated trip message', () => {
  const f=fixture();
  assert.equal(f.submit(),false);
  const message=f.fields['inquiry-message'].value;
  assert.match(message,/Name: Ana García/);
  assert.match(message,/Email: ana@example.com/);
  assert.match(message,/Starting location: Moshi \/ café & hotel/);
  assert.match(message,/Date flexibility: Within a few days/);
  assert.match(message,/Travellers: 4/);
  assert.ok(message.includes(f.values['trip-message']));
  assert.equal(f.fields['inquiry-ready'].hidden,true);
  assert.match(f.fields['inquiry-status'].textContent,/Continue to the anti-spam check/);
});

test('the WhatsApp option prepares both drafts without submitting the email form', () => {
  const {fields,form,values,submit}=fixture();
  assert.equal(submit('prepare-whatsapp'),true);
  assert.equal(fields['inquiry-ready'].hidden,false);
  const message = fields['inquiry-preview'].textContent;
  assert.match(message,/Starting location: Moshi \/ café & hotel/);
  assert.match(message,/Date flexibility: Within a few days/);
  assert.match(message,/Travellers: 4/);
  assert.ok(message.includes(values['trip-message']));
  assert.equal(new URL(fields['inquiry-whatsapp'].href).searchParams.get('text'),message);
  assert.equal(new URL(fields['inquiry-email'].href).searchParams.get('body'),message);
  assert.equal(fields['inquiry-whatsapp'].focused,true);
  assert.match(fields['inquiry-status'].textContent,/Nothing has been sent yet/);
  fields['inquiry-preview'].textContent = 'old message';
  form.events.input();
  assert.equal(fields['inquiry-ready'].hidden,true);
  assert.equal(fields['inquiry-preview'].textContent,'');
  assert.equal(fields['inquiry-message'].value,'');
});

test('invalid consent or contact details cannot submit an email enquiry or expose a ready draft', () => {
  for(const [id,value] of [['privacy-consent',false],['customer-email','invalid'],['traveler-count','0']]) {
    const f=fixture();
    if(id==='privacy-consent')f.fields[id].checked=value;else f.fields[id].value=value;
    assert.equal(f.submit(),true,id);
    assert.equal(f.fields['inquiry-ready'].hidden,true,id);
    assert.equal(f.fields['inquiry-message'].value,'',id);
    assert.equal(f.fields['inquiry-status'].focused,true,id);
  }
});

test('native form validation failure prevents submission before building any outgoing message', () => {
  const f=fixture();f.form.reportValidity=()=>false;
  assert.equal(f.submit(),true);
  assert.equal(f.fields['inquiry-message'].value,'');
  assert.equal(f.fields['inquiry-ready'].hidden,true);
});

test('email and WhatsApp enquiries preserve distinct guest-reported and promotion sources', () => {
  const campaign='source: instagram; medium: social; campaign: marangu_oct2026; entry page: /marangu-village-tour.html';
  for (const button of [undefined, 'prepare-whatsapp']) {
    const f=fixture({campaign,referral:'Friend or past guest'});
    assert.equal(f.submit(button),button==='prepare-whatsapp');
    const message=f.fields['inquiry-message'].value;
    assert.match(message,/How I found David Explora: Friend or past guest/);
    assert.ok(message.includes('Promotion link: '+campaign));
    assert.equal(f.fields['inquiry-campaign'].value,campaign);
    assert.equal(new URL(f.fields['inquiry-whatsapp'].href).searchParams.get('text'),message);
    assert.equal(new URL(f.fields['inquiry-email'].href).searchParams.get('body'),message);
  }
});

test('source questions remain optional and do not block direct enquiries', () => {
  const f=fixture();
  assert.equal(f.submit(),false);
  assert.doesNotMatch(f.fields['inquiry-message'].value,/How I found|Promotion link/);
});
