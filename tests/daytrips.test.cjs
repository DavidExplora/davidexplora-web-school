const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {getTour} = require('../packages.js');
const costs = require('../data/daytrip-costs.json');
const credits = require('../data/photo-credits.json');

test('city walks remain distinct from the transported Marangu village day', () => {
  const arusha=getTour('arusha-city-tour'),moshi=getTour('moshi-city-tour'),marangu=getTour('marangu-village-tour');
  assert.ok(arusha.start.startsWith('Arusha'));
  assert.ok(moshi.start.startsWith('Moshi'));
  assert.ok(marangu.includes.some(item=>/return transport/i.test(item)));
  assert.ok(arusha.excludes.some(item=>/transport/i.test(item)));
  assert.ok(moshi.excludes.some(item=>/transport/i.test(item)));
  assert.equal(getTour('moshi-arusha-city-walk'),null);
});
test('day-trip price assumptions retain the minimum modeled operating contribution', () => {
  for (const [id,model] of Object.entries(costs.models)) {
    const tour=getTour(id);
    const revenue=tour.price*model.group;
    const expense=Object.entries(model).filter(([key])=>key!=='group').reduce((sum,[,value])=>sum+value,0);
    assert.ok((revenue-expense)/revenue>=costs.minimum_modeled_margin,id);
    assert.equal(tour.group,model.group);
  }
  assert.match(costs.status,/not verified supplier rates/);
});
test('new licensed gallery photos have traceable attribution and commercial-use licences', () => {
  for (const id of ['arusha-city-tour','moshi-city-tour','marangu-village-tour','materuni-waterfall-coffee','chemka-springs-day']) {
    const tour=getTour(id);assert.ok(tour.gallery.length>=2,id);
    for (const picture of tour.gallery) {
      assert.ok(fs.existsSync(picture.image));assert.ok(picture.alt && picture.caption);
      if (picture.image.startsWith('images/daytrips/')) {
        const credit=credits.find(c=>c.file===picture.image);
        assert.ok(credit && credit.author && credit.source_url);
        assert.match(credit.license,/^CC BY(?:-SA)? /);
        assert.ok(credit.original_width>=1920 || credit.original_height>=1920);
      }
    }
  }
});
