'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {filterArticles,cleanReading,readReading,toggleReading,compareIds,comparisonRows,readingProgress}=require('../journal.js');
const {cleanSaved}=require('../features.js');
const {tours,getTour,requestPreset}=require('../packages.js');
const articles=require('../data/articles.json');
const special=require('../data/special-journeys.json').journeys;

test('article search combines subjects, full guide content and saved-only choices',()=>{
  assert.deepEqual(filterArticles({category:'local',query:'MARANGU'}).map(a=>a.id),['marangu-village-or-forest']);
  assert.equal(filterArticles({category:'safari',query:'tides'}).length,0);
  assert.ok(filterArticles({category:'trekking',query:'boots'}).some(a=>a.id==='kilimanjaro-preparation'));
  assert.deepEqual(filterArticles({savedIds:[]}),[]);
  assert.deepEqual(filterArticles({category:'safari',savedIds:['planning-serengeti-safari','zanzibar-coast-tides']}).map(a=>a.id),['planning-serengeti-safari']);
  assert.equal(filterArticles({category:'__proto__'}).length,articles.length);
});
test('reading lists recover from blocked or corrupt storage and reject stale ids',()=>{
  assert.deepEqual(cleanReading(['constructor','unknown','zanzibar-coast-tides','zanzibar-coast-tides']),['zanzibar-coast-tides']);
  for(const value of ['{broken','{}','null'])assert.deepEqual(readReading({getItem:()=>value}),[]);
  assert.deepEqual(readReading({getItem(){throw Error('blocked');}}),[]);
  assert.deepEqual(toggleReading(['choosing-kilimanjaro-route'],'choosing-kilimanjaro-route'),[]);
  assert.deepEqual(toggleReading([],'education-through-tourism'),['education-through-tourism']);
});
test('special comparisons are capped, factual and contain no fabricated price or donation',()=>{
  const ids=special.map(j=>j.id);
  assert.deepEqual(compareIds(['__proto__',ids[0],ids[0],...ids.slice(1)]),ids.slice(0,3));
  const rows=comparisonRows([ids[0],ids[2]]);
  assert.equal(rows[0].nights,13);assert.equal(rows[0].mountainDays,7);
  assert.equal(rows[1].nights,8);assert.equal(rows[1].mountainDays,7);
  assert.ok(rows.every(row=>row.price.startsWith('Personal quote')&&row.support==='No donation or school visit included'));
});
test('new journey totals include arrival and departure without compressing mountain days',()=>{
  for(const item of special){const t=getTour(item.id);assert.equal(t.itinerary.length,t.tripDays,t.id);assert.equal(t.nights,t.tripDays-1);assert.equal(t.price,null);assert.equal(t.price2,null);}
  assert.equal(requestPreset('14-day-kilimanjaro-safari-journey').duration,'11+ days');
  assert.equal(requestPreset('9-day-mens-kilimanjaro-journey').duration,'8–10 days');
  assert.equal(requestPreset('7-day-zanzibar-culture-coast').destination,'Zanzibar');
  assert.match(getTour('9-day-mens-kilimanjaro-journey').summary,/fathers travelling with adult sons/);
  assert.equal(cleanSaved(tours.map(t=>t.id)).length,tours.length);
});
test('all original guides have crawlable articles, sections, sources and valid related tours',()=>{
  assert.equal(articles.length,12);assert.equal(new Set(articles.map(a=>a.id)).size,articles.length);
  for(const a of articles){
    const html=fs.readFileSync(a.id+'.html','utf8');
    assert.ok(a.sources.length&&a.sections.length>=4&&a.lede);
    assert.ok(a.related.every(id=>getTour(id)));assert.ok(fs.existsSync(a.image));
    assert.match(html,/"@type": "Article"/);assert.ok(html.includes(a.title.replaceAll('&','&amp;')));
    assert.ok(a.sections.every(section=>html.includes('id="'+section.id+'"')));
    assert.ok(html.includes('data-reading-progress'));assert.ok(html.includes('data-print-itinerary'));
  }
});
test('reading progress handles the top, end and shorter-than-viewport articles',()=>{
  assert.equal(readingProgress(0,120,1500,800),0);
  assert.equal(readingProgress(820,120,1500,800),100);
  assert.equal(readingProgress(470,120,1500,800),50);
  assert.equal(readingProgress(140,120,300,800),100);
});
