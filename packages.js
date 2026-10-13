/* Tour catalogue logic shared by the browser and meaningful Node checks. */
(function (root, factory) {
  'use strict';
  const data = typeof module === 'object' && module.exports ? require('./tour-data.js') : root.DavidTourData;
  const api = factory(data);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DavidTours = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (tours) {
  'use strict';
  function filterTours(criteria) {
    const c = criteria || {};
    const query = String(c.query || '').trim().toLocaleLowerCase();
    const ceiling = Number(c.budget || 0);
    return tours.filter(tour => {
      if (c.category && c.category !== 'all' && tour.category !== c.category) return false;
      if (c.length === 'day' && tour.days > 1) return false;
      if (c.length === 'short' && (tour.days < 2 || tour.days > 4)) return false;
      if (c.length === 'long' && tour.days < 5) return false;
      if (/^\d+$/.test(String(c.length || '')) && tour.days !== Number(c.length)) return false;
      if (Array.isArray(c.savedIds) && !c.savedIds.includes(tour.id)) return false;
      if (ceiling > 0 && (tour.price === null || tour.price > ceiling)) return false;
      const haystack = [tour.title, tour.category, tour.style, tour.start, tour.summary, ...tour.places].join(' ').toLocaleLowerCase();
      return !query || haystack.includes(query);
    });
  }
  function getTour(id) { return tours.find(tour => tour.id === id) || null; }
  function requestPreset(id) {
    const tour = getTour(id);
    if (!tour) return null;
    const duration = tour.tripDays <= 2 ? '1–2 days' : tour.tripDays <= 4 ? '3–4 days' : tour.tripDays <= 7 ? '5–7 days' : tour.tripDays <= 10 ? '8–10 days' : '11+ days';
    const destination = { safari:'Safari', trekking:'Kilimanjaro', zanzibar:'Zanzibar', local:'Local Tanzania', combined:'Combined Tanzania trip' }[tour.category];
    const guide = tour.price === null ? 'Please prepare a personal quote.' : 'I saw the estimated guide price of USD '+tour.price.toLocaleString('en-US')+' per adult, based on '+tour.basis+'. Please confirm the price for my actual group and dates.';
    return { destination, duration, travelers:tour.group, package:tour.title, style:tour.style, message:'I am interested in '+tour.title+' ('+tour.duration+'). '+guide+'\nStarting and ending point: '+tour.start+'. Please confirm the itinerary, accommodation or equipment, inclusions, exclusions and booking terms.' };
  }
  return { tours, getTour, filterTours, requestPreset };
});
