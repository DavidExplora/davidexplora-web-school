const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const api = require('../discovery.js');
const areas = require('../destination-data.js');
const {createInquiry} = require('../journey.js');
test('all map destinations resolve to existing journeys and geographic map searches', () => {
  assert.equal(new Set(areas.map(a=>a.id)).size,8);
  for (const area of areas) {
    assert.equal(api.destination(areas,area.id),area);
    assert.ok(fs.existsSync(area.tours.split('?')[0]));
    assert.ok(fs.existsSync(area.image));
    const url = new URL(api.mapURL(area));
    assert.equal(url.searchParams.get('query'),`${area.latitude},${area.longitude}`);
    assert.ok(area.latitude < 0 && area.latitude > -12 && area.longitude > 29 && area.longitude < 41);
  }
  assert.equal(api.destination(areas,'constructor'),null);
});
test('public listings reject scripts, impersonating hosts and unsupported platforms', () => {
  for (const value of ['javascript:alert(1)','https://www.viator.com.evil.test/','https://viator.com@evil.test/','http://www.viator.com/','']) assert.equal(api.publicLink('viator',value),null);
  assert.equal(api.publicLink('constructor','https://viator.com/'),null);
  assert.equal(api.publicLink('google','https://maps.app.goo.gl/example'),'https://maps.app.goo.gl/example');
  assert.equal(api.publicLink('getyourguide','https://www.getyourguide.com/example'),'https://www.getyourguide.com/example');
});
test('email draft preserves the validated request without allowing mail header injection', () => {
  const result=createInquiry({name:'Ana\nBcc:other@example.com',email:'ana@example.com',travelers:2,destination:'Safari',duration:'5–7 days',consent:true,message:'Café & wildlife? 😊'},'2026-10-11');
  const url=new URL(result.emailURL);
  assert.equal(url.pathname,'davidlyamuya819@gmail.com');
  assert.equal(url.searchParams.get('body'),result.text);
  assert.ok(!url.searchParams.get('subject').includes('\n'));
  assert.equal(url.searchParams.size,2);
  assert.equal(createInquiry({consent:false}).emailURL,undefined);
});
