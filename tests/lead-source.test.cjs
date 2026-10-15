'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const lead = require('../lead-source.js');

function tab(search = '', page = '/', shared = new Map(), clock = {now: 10000000}) {
  const root = {location: {search, pathname: page}, Date: {now: () => clock.now},
    sessionStorage: {getItem: key => shared.get(key) ?? null,
      setItem: (key, value) => shared.set(key, value), removeItem: key => shared.delete(key)}};
  return {root, shared, clock, source: lead.install(root)};
}

test('a promotion survives detail-page navigation without retaining contact details or full URLs', () => {
  const first = tab('?utm_source=instagram&utm_medium=social&utm_campaign=marangu_oct2026&email=guest@example.com#secret', '/marangu-village-tour.html');
  const next = tab('?package=marangu-village-tour', '/index.html', first.shared, first.clock);
  assert.match(next.source.describe(), /source: instagram; medium: social; campaign: marangu_oct2026/);
  assert.match(next.source.describe(), /entry page: \/marangu-village-tour.html/);
  assert.doesNotMatch(JSON.stringify([...first.shared]), /guest|example|secret|package=/);
});

test('promotion entry pages survive clean URL redirects and exclude unrecognised paths', () => {
  for(const page of ['/marangu-village-tour','/marangu-village-tour/','/marangu-village-tour.html']) {
    const first=tab('?utm_source=instagram',page);
    const next=tab('', '/', first.shared, first.clock);
    assert.equal(next.source.describe(),'source: instagram; entry page: /marangu-village-tour.html');
  }
  assert.equal(tab('?utm_source=instagram','/guest-alice-smith.html').source.describe(),'source: instagram; entry page: /');
});

test('new promotion links replace the old label and the record expires after 30 minutes', () => {
  const first = tab('?utm_source=instagram', '/');
  const later = tab('?utm_source=partner&utm_medium=referral', '/moshi-city-walk.html', first.shared, first.clock);
  assert.match(later.source.describe(), /^source: partner/);
  later.clock.now += lead.lifetime;
  assert.equal(later.source.describe(), '');
  assert.equal(first.shared.has(lead.key), false);
});

test('direct visits and unsupported or malformed labels do not invent a marketing source', () => {
  assert.equal(tab().source.describe(), '');
  assert.equal(tab('?utm_source=unknown&utm_campaign=test').source.describe(), '');
  const value = tab('?utm_source=instagram&utm_medium=guest%40example.com&utm_campaign=%3Cscript%3E', '/bad.html?email=guest@example.com').source.describe();
  assert.equal(value, 'source: instagram; entry page: /');
});

test('corrupt, expired and future-dated storage is discarded safely', () => {
  for (const value of ['broken JSON', JSON.stringify({source:'instagram',time:999999999}), JSON.stringify({source:'instagram',time:0})]) {
    const shared = new Map([[lead.key, value]]);
    assert.equal(tab('', '/', shared).source.describe(), '');
    assert.equal(shared.has(lead.key), false);
  }
});

test('blocked browser storage keeps the current page usable and expires in-memory labels', () => {
  const root = {location:{search:'?utm_source=whatsapp',pathname:'/index.html'}, Date:{now:() => clock}};
  let clock = 10000000;
  Object.defineProperty(root, 'sessionStorage', {get(){throw new Error('blocked');}});
  const source = lead.install(root);
  assert.match(source.describe(), /source: whatsapp/);
  clock += lead.lifetime;
  assert.equal(source.describe(), '');
});
