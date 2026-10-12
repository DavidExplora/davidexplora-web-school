const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const tours = require('../packages.js');
const journey = require('../journey.js');
const destinations = require('../destination-data.js');

function fixture(search = '') {
  const fields = {};
  for (const [id, value] of Object.entries({ 'trip-package':'', 'trip-destination':'', 'trip-duration':'', 'trip-style':'Help me decide', 'trip-message':'', 'traveler-count':'2' })) {
    fields[id] = { value, events:{}, addEventListener(name, fn) { this.events[name] = fn; }, fire(name) { this.events[name]?.(); } };
  }
  const document = {
    getElementById: id => fields[id],
    querySelectorAll: () => [],
    querySelector: selector => selector === '#trip-inquiry-form' ? {} : fields[selector.slice(1)] || null
  };
  const window = { DavidTours:tours, location:{search}, matchMedia:() => ({ matches:false }) };
  vm.runInNewContext(fs.readFileSync('experience.js','utf8'), { window, document, URLSearchParams });
  const choose = id => { fields['trip-package'].value = id; fields['trip-package'].fire('change'); };
  return { fields, choose };
}

test('every map destination has a form preset; old experience links still work', () => {
  for (const area of destinations) {
    const preset = journey.urlPreset('?trip=' + area.trip);
    assert.ok(preset, area.name);
    assert.ok(Object.values(journey.destinations).includes(preset[0]));
    assert.ok(preset[2].length > 20);
  }
  assert.deepEqual(journey.urlPreset('?experience=machame'), journey.presets.machame);
  assert.equal(journey.urlPreset('?trip=constructor'), null);
});

test('changing packages preserves the actual party size and customer-written message', () => {
  const f = fixture();
  f.choose('2-day-tarangire-ngorongoro');
  assert.equal(f.fields['traveler-count'].value, '2');
  f.fields['trip-message'].value = 'We have two children and would like vegetarian meals.';
  f.fields['trip-message'].fire('input');
  f.fields['traveler-count'].value = '4';
  f.choose('5-day-northern-lodge-safari');
  assert.equal(f.fields['traveler-count'].value, '4');
  assert.equal(f.fields['trip-message'].value, 'We have two children and would like vegetarian meals.');
});

test('untouched package defaults update and clear without removing customer preferences', () => {
  const f = fixture();
  f.choose('7-day-machame-trek');
  assert.equal(f.fields['trip-destination'].value, 'Kilimanjaro');
  f.fields['trip-duration'].value = '11+ days';
  f.fields['trip-duration'].fire('change');
  f.choose('mnemba-waters-snorkeling');
  assert.equal(f.fields['trip-destination'].value, 'Zanzibar');
  assert.equal(f.fields['trip-duration'].value, '11+ days');
  f.choose('');
  assert.equal(f.fields['trip-destination'].value, '');
  assert.equal(f.fields['trip-message'].value, '');
  assert.equal(f.fields['trip-duration'].value, '11+ days');
});

test('package URLs prefill the chosen tour while retaining a two-person party', () => {
  const f = fixture('?package=4-day-serengeti-camping&trip=zanzibar');
  assert.equal(f.fields['trip-package'].value, '4-day-serengeti-camping');
  assert.equal(f.fields['trip-destination'].value, 'Safari');
  assert.equal(f.fields['traveler-count'].value, '2');
});
