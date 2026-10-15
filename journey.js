/* Shared, deterministic planning and inquiry logic; also testable with Node. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DavidJourney = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const phone = '255778321400';
  const destinations = { kilimanjaro: 'Kilimanjaro', safari: 'Safari', zanzibar: 'Zanzibar', local: 'Local Tanzania' };
  const durations = { '3-4': '3–4 days', '5-7': '5–7 days', '8-10': '8–10 days', '11-plus': '11+ days' };
  const interests = { adventure: 'adventure', wildlife: 'wildlife', beach: 'beach and island time', culture: 'culture and local life', mixed: 'a mix of experiences' };
  const presets = {
    kilimanjaro: ['Kilimanjaro', '', 'I would like to discuss a Kilimanjaro trek or day hike. Please help me choose a suitable route.'],
    machame: ['Kilimanjaro', '8–10 days', 'I am interested in the 7-day Machame trek, with arrival and departure time around it. Please confirm the itinerary and inclusions.'],
    lemosho: ['Kilimanjaro', '8–10 days', 'I am interested in the 8-day Lemosho trek, with arrival and departure time around it. Please confirm the itinerary and inclusions.'],
    marangu: ['Kilimanjaro', '8–10 days', 'I am interested in the 6-day Marangu trek, with arrival and departure time around it. Please confirm the itinerary and inclusions.'],
    safari: ['Safari', '', 'I would like to plan a Tanzania wildlife safari.'],
    serengeti: ['Safari', '', 'I would like to include the Serengeti in my safari.'],
    ngorongoro: ['Safari', '', 'I would like to include Ngorongoro in my safari.'],
    tarangire: ['Safari', '', 'I would like to include Tarangire in my safari.'],
    manyara: ['Safari', '', 'I would like to include Lake Manyara in my safari.'],
    arusha: ['Safari', '', 'I would like to plan a safari starting in Arusha. Please include arrival and pickup arrangements.'],
    moshi: ['Local Tanzania', '1–2 days', 'I would like to explore Moshi and the Kilimanjaro foothills. Please suggest a local day trip.'],
    zanzibar: ['Zanzibar', '', 'I would like to plan a Zanzibar stay and island experiences.'],
    'stone-town': ['Zanzibar', '1–2 days', 'I would like to plan a guided Stone Town experience.'],
    'prison-island': ['Zanzibar', '1–2 days', 'I would like to plan a Changuu / Prison Island excursion from Stone Town. Please confirm boat arrangements and entry fees.'],
    mnemba: ['Zanzibar', '1–2 days', 'I would like to request a snorkelling excursion in the waters around Mnemba. Please confirm transfers, marine fees and equipment.'],
    local: ['Local Tanzania', '1–2 days', 'I would like a local experience around Moshi or Marangu, such as a waterfall walk or coffee visit.'],
    'northern-safari': ['Safari', '5–7 days', 'I am interested in a 4–6 day northern safari through Tarangire, Ngorongoro and Serengeti. Please allow for arrival and departure logistics.'],
    'safari-zanzibar': ['Combined Tanzania trip', '8–10 days', 'I would like to combine a mainland wildlife safari with Zanzibar. Please include transfer and flight options in the quote.']
  };

  function urlPreset(search) {
    const params = new URLSearchParams(search);
    const key = params.get('trip') || params.get('experience');
    return Object.hasOwn(presets, key) ? [...presets[key]] : null;
  }

  function buildPlan(selection) {
    const { destination, interest, duration } = selection || {};
    if (!Object.hasOwn(destinations, destination) || !Object.hasOwn(interests, interest) || !Object.hasOwn(durations, duration)) return null;
    const plans = {
      kilimanjaro: {
        title: 'Mountain trails & foothill stories', link: 'kilimanjaro.html',
        summary: 'Start around Moshi or Marangu, explore a guided mountain day hike and leave time for local foothill experiences.',
        steps: ['Arrive, meet your guide and discuss the day-hike plan.', 'Take a guided forest hike with the permitted turnaround point confirmed in advance.', 'Add a waterfall or coffee experience before departure.'],
        note: 'A 3–4 day visit is a day-hike and foothills idea. It is too short for the summit routes shown on this website.'
      },
      safari: {
        title: 'Your northern Tanzania safari', link: 'safari.html',
        summary: 'Build a realistic wildlife route from your arrival point, balancing time in the parks with the drives between them.',
        steps: ['Confirm your starting point, vehicle and accommodation style.', 'Explore a focused park route at a pace suited to your days.', 'Return with departure logistics and time on the road included in the itinerary.'],
        note: 'For 3–4 days, focus on nearby northern parks. Adding the Serengeti may need a longer itinerary or extra transfer arrangements. Wildlife sightings are never guaranteed.'
      },
      zanzibar: {
        title: 'Stone Town and the Zanzibar coast', link: 'zanzibar.html',
        summary: 'Pair Stone Town with coast time and choose an island or snorkelling excursion that suits your interests.',
        steps: ['Arrive and explore Stone Town with a local guide.', 'Choose a Changuu boat visit or a snorkelling day in the waters around Mnemba.', 'Leave space for the coast and your departure transfer.'],
        note: 'Boat activities depend on weather and sea conditions. Transfers, marine access fees and equipment must be confirmed in the quote; Mnemba island landing is not included.'
      },
      local: {
        title: 'The everyday side of Tanzania', link: 'local-tanzania.html',
        summary: 'Build your visit around Moshi, Marangu and the Kilimanjaro foothills, with nature and local encounters at its centre.',
        steps: ['Meet David and choose a day plan based on your pickup location.', 'Combine a guided walk with a coffee or village experience.', 'Add another local day or an onward destination if your time allows.'],
        note: 'Walks and activity arrangements depend on conditions and access. Longer stays can combine local days with a wider Tanzania itinerary.'
      }
    };
    const plan = { ...plans[destination], steps: [...plans[destination].steps], destination: destinations[destination], duration: durations[duration], interest: interests[interest] };
    if (destination === 'kilimanjaro' && duration !== '3-4') {
      plan.title = duration === '5-7' ? 'Choose the right mountain route' : 'A mountain journey with time to prepare';
      plan.summary = 'Compare the 6-day Marangu, 7-day Machame and 8-day Lemosho examples, then discuss a route and total trip length with David.';
      plan.steps = ['Allow time for arrival, preparation and a guide briefing.', 'Follow a confirmed multi-day route with acclimatization built into the itinerary.', 'Allow for descent, recovery and your onward travel.'];
      plan.note = 'Route days are trekking days. Add arrival and departure time. A 5–7 day total visit may be too short for your chosen route; David will confirm a realistic schedule. Summit success is not guaranteed.';
      if (duration === '11-plus') plan.summary += ' With more time, ask about recovery days and a safari extension.';
    }
    if (destination === 'safari' && duration !== '3-4') {
      plan.summary = 'Discuss Tarangire, Ngorongoro and the Serengeti, allowing time for transfers and the wildlife areas that suit your dates.';
      plan.steps[1] = 'Follow a confirmed northern circuit with a balance of game drives and travel days.';
      plan.note = 'The final parks, accommodation and route depend on your dates, budget and available time. Wildlife sightings and migration locations cannot be guaranteed.';
    }
    const natural = {kilimanjaro:['adventure','culture','mixed'],safari:['wildlife','adventure','mixed'],zanzibar:['beach','culture','adventure','mixed'],local:['culture','adventure','mixed']};
    if (!natural[destination].includes(interest)) plan.note += ' Your interest in '+interests[interest]+' may fit an additional destination; ask David how much extra time it needs.';
    plan.message = 'I am interested in '+plan.duration+' in Tanzania, focused on '+plan.interest+'. My starting idea is “'+plan.title+'”. Please help me confirm a realistic itinerary, arrangements and personal quote.';
    return plan;
  }

  function clean(value, max) { return String(value || '').replace(/[\r\n\u0000-\u001f]/g, ' ').trim().slice(0, max); }
  function validateInquiry(input, today) {
    const data = input || {};
    const errors = [];
    const name = clean(data.name, 100), email = String(data.email || '').trim();
    if (!name) errors.push('Please enter your name.');
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address.');
    const whatsapp = clean(data.whatsapp, 40);
    if (whatsapp && (!/^[+()\d\s.\-]+$/.test(whatsapp) || whatsapp.replace(/\D/g,'').length < 7 || whatsapp.replace(/\D/g,'').length > 15)) errors.push('Please check your WhatsApp number and country code.');
    const travelers = Number(data.travelers);
    if (!Number.isInteger(travelers) || travelers < 1 || travelers > 50) errors.push('Please choose between 1 and 50 travellers.');
    const arrival = clean(data.arrival, 120);
    const flexibility = data.flexibility || 'Dates to discuss';
    if (!['Exact dates', 'Within a few days', 'Dates to discuss'].includes(flexibility)) errors.push('Please choose your date flexibility.');
    const packageName = clean(data.package, 160);
    const budget = String(data.budget ?? '').trim();
    if (budget && (!/^\d+$/.test(budget) || Number(budget) < 1 || Number(budget) > 1000000)) errors.push('Please enter a whole USD budget between 1 and 1,000,000 per adult, or leave it blank.');
    const date = String(data.date || '');
    if (date) {
      const parsed = new Date(date+'T00:00:00Z');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0,10) !== date) errors.push('Please choose a valid arrival date.');
      else if (today && date < today) errors.push('Please choose today or a future arrival date.');
    }
    const allowedDestinations = [...Object.values(destinations), 'Combined Tanzania trip', 'Help me choose'];
    const allowedDurations = [...Object.values(durations), '1–2 days', 'Flexible'];
    if (!allowedDestinations.includes(data.destination)) errors.push('Please choose a destination.');
    if (!allowedDurations.includes(data.duration)) errors.push('Please choose your trip length.');
    if (data.consent !== true) errors.push('Please read and agree to the privacy and booking information.');
    const referral = ['Instagram', 'Google Search or Maps', 'WhatsApp', 'Facebook', 'TikTok', 'LinkedIn', 'Hotel or travel partner', 'Friend or past guest', 'Other'].includes(data.referral) ? data.referral : '';
    return { errors, values: { name, email, whatsapp, travelers, date, arrival, flexibility, package: packageName, budget, referral, campaign: clean(data.campaign, 420), destination: data.destination, duration: data.duration, style: clean(data.style || 'Help me decide',70), language: clean(data.language || 'English',70), message: String(data.message || '').replace(/\u0000/g,'').trim().slice(0,1800) } };
  }
  function createInquiry(input, today) {
    const result = validateInquiry(input, today);
    if (result.errors.length) return { ...result, text: '', url: '' };
    const v = result.values;
    const attribution = (v.referral ? '\nHow I found David Explora: ' + v.referral : '') + (v.campaign ? '\nPromotion link: ' + v.campaign : '');
    const text = 'Hello David, I would like to plan a Tanzania trip.\n\nName: '+v.name+'\nEmail: '+v.email+'\nWhatsApp: '+(v.whatsapp || 'Contact me here or by email')+'\nPreferred arrival: '+(v.date || 'Flexible / to discuss')+'\nDate flexibility: '+v.flexibility+'\nStarting location: '+(v.arrival || 'Please help me choose')+'\nTravellers: '+v.travelers+'\nStarting itinerary: '+(v.package || 'Personal trip / help me choose')+'\nBudget per adult: '+(v.budget ? 'USD '+Number(v.budget).toLocaleString('en-US') : 'To discuss')+'\nDestination: '+v.destination+'\nTime in Tanzania: '+v.duration+'\nTravel style: '+v.style+'\nGuide language requested: '+v.language+attribution+'\n\nMy trip idea:\n'+(v.message || 'Please help me choose a suitable itinerary.')+'\n\nPlease send a proposed itinerary, an itemised quote with inclusions and exclusions, and the booking terms for my dates and group.';
    return { ...result, text, url: 'https://wa.me/'+phone+'?text='+encodeURIComponent(text), emailURL: 'mailto:info@davidexplora.com?subject='+encodeURIComponent('Tanzania trip request — '+v.name)+'&body='+encodeURIComponent(text) };
  }
  return { phone, destinations, durations, interests, presets, urlPreset, buildPlan, validateInquiry, createInquiry };
});
