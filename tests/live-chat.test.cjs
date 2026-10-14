'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { install, embedURL } = require('../live-chat.js');

function fixture({ hostname = 'davidexplora.com', protocol = 'https:', controls = true } = {}) {
  const elements = new Map(), events = new Map(), classes = new Set(), scripts = [];
  const launcher = { hidden: false, attrs: { 'aria-expanded': 'true' }, setAttribute(name, value) { this.attrs[name] = value; } };
  const link = {};
  const welcome = { hidden: false, contains: element => element === link };
  if (controls) { elements.set('welcome-launch', launcher); elements.set('david-welcome', welcome); }
  const doc = {
    activeElement: {},
    body: { classList: { add: value => classes.add(value) } },
    head: { appendChild(script) { scripts.push(script); elements.set(script.id, script); } },
    getElementById: id => elements.get(id) || null,
    createElement(tag) { assert.equal(tag, 'script'); return { attrs: {}, setAttribute(name, value) { this.attrs[name] = value; } }; },
    addEventListener(type, fn) { events.set(type, fn); },
    removeEventListener(type, fn) { if (events.get(type) === fn) events.delete(type); },
    querySelector() { throw Error('Chat must not read enquiry form fields'); }
  };
  const root = { location: { hostname, protocol } };
  return { root, doc, elements, events, classes, scripts, launcher, welcome, link };
}

test('the supplied widget loads asynchronously once on each production hostname', () => {
  for (const hostname of ['davidexplora.com', 'www.davidexplora.com', 'david-explora.fastash16.chatgpt.site']) {
    const f = fixture({ hostname }), state = install(f.root, f.doc);
    assert.equal(state.installed, true); assert.equal(state.ready, false);
    assert.equal(f.scripts.length, 1); assert.equal(f.scripts[0].src, embedURL);
    assert.equal(f.scripts[0].src, 'https://embed.tawk.to/6acfc0086fd69f34cebb33c5/1k4toc8sl');
    assert.equal(f.scripts[0].async, true); assert.equal(f.scripts[0].attrs.crossorigin, 'anonymous');
    assert.equal(install(f.root, f.doc), state); assert.equal(f.scripts.length, 1);
  }
});

test('local, insecure and lookalike origins leave the existing contact controls available', () => {
  for (const settings of [{ hostname: 'localhost' }, { hostname: '127.0.0.1' }, { hostname: '', protocol: 'file:' }, { protocol: 'http:' }, { hostname: 'davidexplora.com.example.org' }]) {
    const f = fixture(settings), state = install(f.root, f.doc);
    assert.equal(state.installed, false); assert.equal(f.scripts.length, 0);
    assert.equal(f.launcher.hidden, false); assert.equal(f.welcome.hidden, false);
  }
});

test('a blocked or failed provider script leaves the fallback usable', () => {
  const f = fixture(), state = install(f.root, f.doc);
  f.scripts[0].onerror();
  assert.equal(state.failed, true); assert.equal(state.ready, false);
  assert.equal(f.classes.has('live-chat-ready'), false);
  assert.equal(f.launcher.hidden, false); assert.equal(f.welcome.hidden, false);
});

test('the rendered widget replaces the fallback while preserving provider callbacks and visibility settings', () => {
  const f = fixture(), calls = [], api = { onLoad(value) { calls.push([this, value]); }, showWidget() { throw Error('Do not override provider visibility unless focus delayed it'); } };
  f.root.Tawk_API = api;
  const state = install(f.root, f.doc);
  assert.equal(f.welcome.hidden, false);
  api.onLoad('rendered');
  assert.deepEqual(calls, [[api, 'rendered']]); assert.equal(state.ready, true);
  assert.equal(f.classes.has('live-chat-ready'), true); assert.equal(f.launcher.hidden, true);
  assert.equal(f.launcher.attrs['aria-expanded'], 'false'); assert.equal(f.welcome.hidden, true);
  assert.equal(api.visitor, undefined); assert.equal(api.setAttributes, undefined);
});

test('chat handoff waits for keyboard focus to leave existing contact controls', () => {
  for (const target of ['launcher', 'link']) {
    const f = fixture(), calls = [];
    f.root.Tawk_API = { hideWidget: () => calls.push('hide'), showWidget: () => calls.push('show') };
    const state = install(f.root, f.doc); f.doc.activeElement = f[target];
    f.root.Tawk_API.onLoad();
    assert.equal(state.ready, false); assert.equal(f.launcher.hidden, false); assert.deepEqual(calls, ['hide']);
    f.events.get('focusin')(); assert.equal(state.ready, false);
    f.doc.activeElement = {}; f.events.get('focusin')();
    assert.equal(state.ready, true); assert.deepEqual(calls, ['hide', 'show']);
    assert.equal(f.events.has('focusin'), false); assert.equal(f.welcome.hidden, true);
  }
});

test('a page without the old controls still completes handoff and callback errors cannot strand the fallback', () => {
  const empty = fixture({ controls: false }); empty.doc.activeElement = null;
  const state = install(empty.root, empty.doc); empty.root.Tawk_API.onLoad(); assert.equal(state.ready, true);
  const f = fixture(); f.root.Tawk_API = { onLoad() { throw Error('Owner callback failed'); } };
  const failedCallback = install(f.root, f.doc);
  assert.throws(() => f.root.Tawk_API.onLoad(), /Owner callback failed/);
  assert.equal(failedCallback.ready, true); assert.equal(f.launcher.hidden, true);
});

test('every generated non-redirect page includes the chat loader exactly once', () => {
  const root = path.join(__dirname, '..');
  const redirects = new Set(Object.keys(require('../data/tour-redirects.json')).map(id => id + '.html'));
  for (const file of fs.readdirSync(root).filter(file => file.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert.equal((html.match(/<script src="live-chat\.js" defer><\/script>/g) || []).length, redirects.has(file) ? 0 : 1, file);
  }
});
