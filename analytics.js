/* Optional Google Analytics loads only after a visitor allows it. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DavidAnalytics = api.install(root, root.document);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const settings = { measurementId: 'G-BD611F1Z0K', enabled: true };
  const key = 'david-explora-analytics-choice-v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const hosts = new Set(['davidexplora.com', 'www.davidexplora.com', 'david-explora.fastash16.chatgpt.site']);
  const sources = new Set(['instagram', 'facebook', 'tiktok', 'linkedin', 'google', 'google_business', 'whatsapp', 'partner', 'referral']);
  const pagePaths = new Set(["/","/14-day-kilimanjaro-safari-journey.html","/2-day-mikumi-safari.html","/2-day-tarangire-ngorongoro.html","/3-day-nyerere-fly-in-zanzibar.html","/3-day-nyerere-road-safari.html","/4-day-luxury-northern-safari.html","/4-day-serengeti-camping.html","/404.html","/5-day-northern-lodge-safari.html","/6-day-drive-in-safari-zanzibar.html","/6-day-marangu-trek.html","/6-day-northern-safari-culture.html","/6-day-zanzibar-island-escape.html","/7-day-machame-trek.html","/7-day-zanzibar-culture-coast.html","/8-day-lemosho-trek.html","/8-day-northern-safari-local-life.html","/9-day-mens-kilimanjaro-journey.html","/9-day-womens-kilimanjaro-journey.html","/about-david.html","/arusha-city-tour.html","/blue-lagoon-snorkeling.html","/booking-payment-checklist.html","/changuu-prison-island.html","/chemka-springs-day.html","/choosing-kilimanjaro-route.html","/christmas-lemosho-group.html","/christmas-machame-group.html","/christmas-northern-safari-group.html","/christmas-on-kilimanjaro.html","/christmas-safari-tanzania.html","/education-through-tourism.html","/education-vision.html","/enquiry-submitted.html","/explore-tanzania.html","/group-departures.html","/how-to-book.html","/journal-education.html","/journal-kilimanjaro.html","/journal-local-life.html","/journal-planning.html","/journal-safari.html","/journal-zanzibar.html","/journal.html","/jozani-forest.html","/kilimanjaro-marangu-day-hike.html","/kilimanjaro-preparation.html","/kilimanjaro.html","/kizimkazi-dolphin-watching.html","/kuza-cave.html","/lemosho.html","/local-tanzania.html","/luxury-northern-safari.html","/maasai-community-day.html","/machame.html","/manyara.html","/marangu-village-or-forest.html","/marangu-village-tour.html","/marangu.html","/materuni-waterfall-coffee.html","/mnemba-waters-snorkeling.html","/mnemba.html","/moshi-arusha-city-walk.html","/moshi-city-tour.html","/nakupenda-sandbank.html","/ngorongoro.html","/packages.html","/payments.html","/photo-credits.html","/planning-serengeti-safari.html","/planning-travel-with-support.html","/prison-island.html","/privacy.html","/safari-zanzibar-journey.html","/safari.html","/serengeti.html","/southern-safaris.html","/special-journeys.html","/stone-town-walking-tour.html","/stone-town.html","/tanzania-safari-seasons.html","/tarangire-day-safari.html","/tarangire.html","/terms.html","/travel-guide.html","/travel-support.html","/understanding-tour-quote.html","/viajes-en-espanol.html","/zanzibar-coast-tides.html","/zanzibar-discover-scuba.html","/zanzibar-jet-ski.html","/zanzibar-mangrove-kayaking.html","/zanzibar-spice-farm.html","/zanzibar.html"]); // Generated from public HTML pages.

  function canonicalPage(value) {
    if (typeof value !== 'string') return '/';
    const path = value.replace(/\/+$/, '');
    const page = !path || path === '/index' || path === '/index.html' ? '/' :
      path.endsWith('.html') ? path : path + '.html';
    return pagePaths.has(page) ? page : '/';
  }

  function safeURL(value, keepCampaign = false) {
    try {
      const url = new URL(value);
      if (!['http:', 'https:'].includes(url.protocol)) return '';
      if (!keepCampaign) return url.origin;
      const path = canonicalPage(url.pathname);
      const clean = new URL(url.origin + path);
      if (sources.has(url.searchParams.get('utm_source'))) {
        for (const name of ['utm_source', 'utm_medium', 'utm_campaign']) {
          const label = url.searchParams.get(name) || '';
          if (/^[a-z0-9][a-z0-9_-]{0,63}$/i.test(label)) clean.searchParams.set(name, label);
        }
      }
      return clean.href;
    } catch (_) { return ''; }
  }

  function install(root, doc, config = settings) {
    if (root.DavidAnalytics?.installed) return root.DavidAnalytics;
    const state = { installed: false, choice: null, loaded: false, failed: false };
    if (!config.enabled || !doc || root.location?.protocol !== 'https:' ||
        !hosts.has(root.location.hostname) || !/^G-[A-Z0-9]+$/.test(config.measurementId)) return state;
    state.installed = true;
    root.DavidAnalytics = state;
    const disabled = 'ga-disable-' + config.measurementId;
    const now = () => root.Date?.now?.() ?? Date.now();
    let choiceButton, panel, heading;
    function readChoice() {
      try {
        const value = JSON.parse(root.localStorage.getItem(key));
        if (['granted', 'denied'].includes(value?.choice) && Number.isFinite(value.time) &&
            value.time <= now() && now() - value.time < lifetime) return value.choice;
      } catch (_) { /* A storage failure leaves Analytics off until a choice is made. */ }
      return null;
    }
    state.choice = readChoice();
    root[disabled] = state.choice !== 'granted';
    root.dataLayer = root.dataLayer || [];
    root.gtag = root.gtag || function () { root.dataLayer.push(arguments); };
    root.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });

    function page() {
      return { page_location: safeURL(root.location.href, true),
        page_referrer: safeURL(doc.referrer || ''), page_title: String(doc.title || '').slice(0, 200) };
    }
    function track(name, method) {
      if (state.choice !== 'granted' || !state.loaded || root[disabled]) return false;
      const params = { ...page(), send_to: config.measurementId };
      if (name === 'contact_click' && ['whatsapp', 'email'].includes(method)) params.contact_method = method;
      else if (!['page_view', 'enquiry_submit'].includes(name)) return false;
      root.gtag('event', name, params);
      return true;
    }
    function load() {
      if (state.loaded || state.choice !== 'granted') return;
      state.loaded = true;
      root[disabled] = false;
      root.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      root.gtag('set', { allow_google_signals: false, allow_ad_personalization_signals: false, ...page() });
      root.gtag('js', new Date());
      root.gtag('config', config.measurementId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, ...page() });
      track('page_view');
      const script = doc.createElement('script');
      script.id = 'david-google-analytics';
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + config.measurementId;
      script.onerror = () => { state.failed = true; };
      doc.head.appendChild(script);
    }
    function clearCookies() {
      const names = (doc.cookie || '').split(';').map(x => x.split('=')[0].trim()).filter(x => /^_ga(?:_|$)/.test(x));
      for (const name of names) for (const domain of ['', 'davidexplora.com', '.davidexplora.com', 'www.davidexplora.com']) {
        doc.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax; Secure' + (domain ? '; domain=' + domain : '');
      }
    }
    function choose(choice) {
      if (!['granted', 'denied'].includes(choice)) return;
      const wasLoaded = state.loaded;
      state.choice = choice;
      try { root.localStorage.setItem(key, JSON.stringify({ choice, time: now() })); } catch (_) { /* The current-page choice still applies. */ }
      panel.hidden = true;
      if (choice === 'granted') load();
      else {
        root[disabled] = true;
        clearCookies();
        // A fresh page fully removes Google's already-loaded automatic listeners.
        if (wasLoaded) root.location.reload();
      }
      if (doc.activeElement && panel.contains(doc.activeElement)) choiceButton.focus();
    }
    state.choose = choose;
    state.track = track;
    panel = doc.createElement('section');
    panel.id = 'analytics-choice';
    panel.className = 'analytics-choice';
    panel.setAttribute('aria-labelledby', 'analytics-choice-title');
    panel.innerHTML = '<h2 id="analytics-choice-title" tabindex="-1">Optional website analytics</h2><p>Google Analytics helps us understand visits and use of the contact buttons. Choose whether to allow Analytics cookies. You can change your choice in the footer. <a href="privacy.html#website-analytics">Privacy information</a>.</p><div class="analytics-actions"><button type="button" data-analytics-accept>Allow Analytics</button><button type="button" data-analytics-decline>Decline Analytics</button></div>';
    panel.hidden = state.choice !== null;
    doc.body.appendChild(panel);
    heading = panel.querySelector('h2');
    panel.querySelector('[data-analytics-accept]').addEventListener('click', () => choose('granted'));
    panel.querySelector('[data-analytics-decline]').addEventListener('click', () => choose('denied'));
    choiceButton = doc.createElement('button');
    choiceButton.type = 'button';
    choiceButton.className = 'analytics-settings';
    choiceButton.textContent = 'Analytics choices';
    choiceButton.setAttribute('aria-controls', panel.id);
    choiceButton.addEventListener('click', () => { panel.hidden = false; heading.focus(); });
    (doc.querySelector('.footer-bottom > div') || doc.body).appendChild(choiceButton);
    panel.addEventListener('keydown', event => {
      if (event.key === 'Escape') { panel.hidden = true; choiceButton.focus(); }
    });
    doc.addEventListener('click', event => {
      const link = event.target?.closest?.('a[href]');
      if (!link) return;
      try {
        const url = new URL(link.href, root.location.href);
        if (url.protocol === 'mailto:') track('contact_click', 'email');
        else if (url.protocol === 'https:' && url.hostname === 'wa.me') track('contact_click', 'whatsapp');
      } catch (_) { /* A malformed link must never break navigation. */ }
    });
    doc.addEventListener('submit', event => {
      if (event.target?.id === 'trip-inquiry-form' && !event.defaultPrevented) track('enquiry_submit');
    });
    root.addEventListener?.('storage', event => {
      if (event.key !== key) return;
      const current = readChoice();
      if (state.choice === 'granted' && current !== 'granted') {
        state.choice = current;
        root[disabled] = true;
        if (state.loaded) root.location.reload();
      }
    });
    if (state.choice === 'granted') load();
    else clearCookies();
    return state;
  }
  return { install, safeURL, settings, key, lifetime };
});
