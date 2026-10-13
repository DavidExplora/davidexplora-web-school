const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const journey = require('../journey.js');
const tours = require('../packages.js');

test('the real enquiry handler prepares both drafts with pickup and flexible dates', () => {
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
    'trip-message':'Two adults and two children aged 9 and 12. Vegetarian lunch, please.'};
  const fields = Object.fromEntries(Object.entries(values).map(([id,value]) => [id,element(value)]));
  for(const id of ['inquiry-status','inquiry-ready','inquiry-preview','inquiry-whatsapp',
    'inquiry-email','copy-status','copy-inquiry','privacy-consent','contact']) fields[id] = element();
  fields['privacy-consent'].checked = true;
  const submit = element(), form = element();
  form.querySelector = () => submit; form.reportValidity = () => true;
  fields['trip-inquiry-form'] = form;
  const document = {body:element(), querySelectorAll:() => [],
    querySelector:selector => fields[selector.slice(1)] || null,
    getElementById:id => fields[id], addEventListener(){}};
  const window = {DavidJourney:journey, DavidTours:tours, location:{search:''},
    matchMedia:() => ({matches:false})};
  vm.runInNewContext(fs.readFileSync('script.js','utf8'), {window,document,Date});
  let prevented = false;
  form.events.submit({preventDefault(){prevented = true;}});
  assert.equal(prevented,true);
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
});
