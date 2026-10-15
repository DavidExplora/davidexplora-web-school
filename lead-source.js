/* Promotion labels stay in this tab for up to 30 minutes and accompany an enquiry only. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DavidLeadSource = api.install(root);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const key = 'david-explora-campaign-v1';
  const lifetime = 30 * 60 * 1000;
  const sources = new Set(['instagram', 'facebook', 'tiktok', 'linkedin', 'google', 'google_business', 'whatsapp', 'partner', 'referral']);
  const label = value => typeof value === 'string' && /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(value) ? value : '';
  const pagePaths = new Set(["/","/14-day-kilimanjaro-safari-journey.html","/2-day-mikumi-safari.html","/2-day-tarangire-ngorongoro.html","/3-day-nyerere-fly-in-zanzibar.html","/3-day-nyerere-road-safari.html","/4-day-luxury-northern-safari.html","/4-day-serengeti-camping.html","/404.html","/5-day-northern-lodge-safari.html","/6-day-drive-in-safari-zanzibar.html","/6-day-marangu-trek.html","/6-day-northern-safari-culture.html","/6-day-zanzibar-island-escape.html","/7-day-machame-trek.html","/7-day-zanzibar-culture-coast.html","/8-day-lemosho-trek.html","/8-day-northern-safari-local-life.html","/9-day-mens-kilimanjaro-journey.html","/9-day-womens-kilimanjaro-journey.html","/about-david.html","/arusha-city-tour.html","/blue-lagoon-snorkeling.html","/booking-payment-checklist.html","/changuu-prison-island.html","/chemka-springs-day.html","/choosing-kilimanjaro-route.html","/christmas-lemosho-group.html","/christmas-machame-group.html","/christmas-northern-safari-group.html","/christmas-on-kilimanjaro.html","/christmas-safari-tanzania.html","/education-through-tourism.html","/education-vision.html","/enquiry-submitted.html","/explore-tanzania.html","/group-departures.html","/how-to-book.html","/journal-education.html","/journal-kilimanjaro.html","/journal-local-life.html","/journal-planning.html","/journal-safari.html","/journal-zanzibar.html","/journal.html","/jozani-forest.html","/kilimanjaro-marangu-day-hike.html","/kilimanjaro-preparation.html","/kilimanjaro.html","/kizimkazi-dolphin-watching.html","/kuza-cave.html","/lemosho.html","/local-tanzania.html","/luxury-northern-safari.html","/maasai-community-day.html","/machame.html","/manyara.html","/marangu-village-or-forest.html","/marangu-village-tour.html","/marangu.html","/materuni-waterfall-coffee.html","/mnemba-waters-snorkeling.html","/mnemba.html","/moshi-arusha-city-walk.html","/moshi-city-tour.html","/nakupenda-sandbank.html","/ngorongoro.html","/packages.html","/payments.html","/photo-credits.html","/planning-serengeti-safari.html","/planning-travel-with-support.html","/prison-island.html","/privacy.html","/safari-zanzibar-journey.html","/safari.html","/serengeti.html","/southern-safaris.html","/special-journeys.html","/stone-town-walking-tour.html","/stone-town.html","/tanzania-safari-seasons.html","/tarangire-day-safari.html","/tarangire.html","/terms.html","/travel-guide.html","/travel-support.html","/understanding-tour-quote.html","/viajes-en-espanol.html","/zanzibar-coast-tides.html","/zanzibar-discover-scuba.html","/zanzibar-jet-ski.html","/zanzibar-mangrove-kayaking.html","/zanzibar-spice-farm.html","/zanzibar.html"]); // Generated from public HTML pages.

  function canonicalPage(value) {
    if (typeof value !== 'string') return '/';
    const path = value.replace(/\/+$/, '');
    const page = !path || path === '/index' || path === '/index.html' ? '/' :
      path.endsWith('.html') ? path : path + '.html';
    return pagePaths.has(page) ? page : '/';
  }

  function valid(record, now) {
    if (!record || !sources.has(record.source) || !Number.isFinite(record.time) ||
        record.time > now || now - record.time >= lifetime) return null;
    const page = canonicalPage(record.page);
    return { source: record.source, medium: label(record.medium), campaign: label(record.campaign), page, time: record.time };
  }

  function parse(search, pathname, now) {
    const params = new URLSearchParams(search);
    const source = (params.get('utm_source') || '').toLowerCase();
    if (!sources.has(source)) return null;
    return valid({ source, medium: params.get('utm_medium'), campaign: params.get('utm_campaign'), page: pathname, time: now }, now);
  }

  function describe(record) {
    if (!record) return '';
    return ['source: ' + record.source, record.medium && 'medium: ' + record.medium,
      record.campaign && 'campaign: ' + record.campaign, 'entry page: ' + record.page].filter(Boolean).join('; ');
  }

  function install(root) {
    const now = () => root.Date?.now?.() ?? Date.now();
    let stored = null;
    try { stored = valid(JSON.parse(root.sessionStorage.getItem(key)), now()); } catch (_) { /* Storage is optional. */ }
    const incoming = parse(root.location?.search || '', root.location?.pathname || '/', now());
    let current = incoming || stored;
    try {
      if (current) root.sessionStorage.setItem(key, JSON.stringify(current));
      else root.sessionStorage.removeItem(key);
    } catch (_) { /* The enquiry works with in-memory labels if storage is blocked. */ }
    return {
      describe() {
        current = valid(current, now());
        if (!current) {
          try { root.sessionStorage.removeItem(key); } catch (_) { /* Storage is optional. */ }
        }
        return describe(current);
      }
    };
  }
  return { install, parse, describe, lifetime, key };
});
