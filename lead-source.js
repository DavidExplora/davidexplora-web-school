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
  const sources = new Set(['instagram', 'facebook', 'tiktok', 'linkedin', 'google', 'google_business', 'whatsapp', 'email', 'partner', 'referral']);
  const label = value => typeof value === 'string' && /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(value) ? value : '';
  const pagePaths = new Set(["/","/14-day-kilimanjaro-safari-journey","/2-day-mikumi-safari","/2-day-tarangire-ngorongoro","/3-day-nyerere-fly-in-zanzibar","/3-day-nyerere-road-safari","/4-day-luxury-northern-safari","/4-day-serengeti-camping","/404","/5-day-northern-lodge-safari","/6-day-drive-in-safari-zanzibar","/6-day-marangu-trek","/6-day-northern-safari-culture","/6-day-zanzibar-island-escape","/7-day-machame-trek","/7-day-zanzibar-culture-coast","/8-day-lemosho-trek","/8-day-northern-safari-local-life","/9-day-mens-kilimanjaro-journey","/9-day-womens-kilimanjaro-journey","/about-david","/arusha-city-tour","/blue-lagoon-snorkeling","/booking-payment-checklist","/changuu-prison-island","/chemka-springs-day","/choosing-kilimanjaro-route","/christmas-lemosho-group","/christmas-machame-group","/christmas-northern-safari-group","/christmas-on-kilimanjaro","/christmas-safari-tanzania","/education-through-tourism","/education-vision","/enquiry-submitted","/explore-tanzania","/group-departures","/how-to-book","/journal","/journal-education","/journal-kilimanjaro","/journal-local-life","/journal-planning","/journal-safari","/journal-zanzibar","/jozani-forest","/kilimanjaro","/kilimanjaro-marangu-day-hike","/kilimanjaro-preparation","/kizimkazi-dolphin-watching","/kuza-cave","/lemosho","/local-tanzania","/luxury-northern-safari","/maasai-community-day","/machame","/manyara","/marangu","/marangu-village-or-forest","/marangu-village-tour","/materuni-waterfall-coffee","/mnemba","/mnemba-waters-snorkeling","/moshi-arusha-city-walk","/moshi-city-tour","/nakupenda-sandbank","/ngorongoro","/packages","/payments","/photo-credits","/planning-serengeti-safari","/planning-travel-with-support","/prison-island","/privacy","/safari","/safari-zanzibar-journey","/serengeti","/southern-safaris","/special-journeys","/stone-town","/stone-town-walking-tour","/tanzania-safari-seasons","/tarangire","/tarangire-day-safari","/terms","/travel-guide","/travel-support","/understanding-tour-quote","/viajes-en-espanol","/zanzibar","/zanzibar-coast-tides","/zanzibar-discover-scuba","/zanzibar-jet-ski","/zanzibar-mangrove-kayaking","/zanzibar-spice-farm"]); // Generated from public HTML pages.

  function canonicalPage(value) {
    if (typeof value !== 'string') return '/';
    const path = value.replace(/\/+$/, '').replace(/\.html$/, '');
    const page = !path || path === '/index' ? '/' : path;
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
