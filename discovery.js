(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    const areas = root.DavidDestinations || [];
    document.querySelectorAll('[data-discovery]').forEach(block => {
      function select(id) {
        const area = api.destination(areas, id); if (!area) return;
        block.querySelectorAll('[data-destination]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.destination === id)));
        block.querySelectorAll('[data-map-dot]').forEach(dot => dot.classList.toggle('is-active', dot.dataset.mapDot === id));
        const img = block.querySelector('.destination-detail img');
        if (area.srcset) img.setAttribute('srcset', area.srcset);
        else img.removeAttribute('srcset');
        img.sizes = '(max-width: 800px) 90vw, 44vw';
        img.src = area.image; img.alt = area.alt;
        img.width = area.width; img.height = area.height;
        img.style.objectPosition = area.id === 'kilimanjaro' ? '50% 30%' : '50% 50%';
        block.querySelector('[data-area-tag]').textContent = area.tag;
        block.querySelector('[data-area-name]').textContent = area.name;
        block.querySelector('[data-area-description]').textContent = area.description;
        block.querySelector('[data-area-tours]').href = area.tours;
        block.querySelector('[data-area-plan]').href = 'index.html?trip=' + encodeURIComponent(area.trip) + '#contact';
        block.querySelector('[data-area-map]').href = api.mapURL(area);
      }
      block.querySelectorAll('[data-destination]').forEach(button => button.addEventListener('click', () => select(button.dataset.destination)));
      block.querySelectorAll('[data-map-select]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); select(link.dataset.mapSelect); }));
      select(areas[0]?.id);
    });
    const labels = {google:'Read Google reviews ↗',getyourguide:'David Explora on GetYourGuide ↗',viator:'David Explora on Viator ↗'};
    document.querySelectorAll('[data-business-presence]').forEach(section => {
      Object.keys(labels).forEach(key => {
        const url = api.publicLink(key, root.DavidBusinessLinks?.[key]); if (!url) return;
        const a = document.createElement('a'); a.href = url; a.textContent = labels[key]; a.target = '_blank'; a.rel = 'noopener noreferrer';
        section.querySelector('[data-business-links]').append(a); section.hidden = false;
      });
    });
  }
})(globalThis, function () {
  'use strict';
  return {
    destination: (areas, id) => areas.find(area => area.id === id) || null,
    mapURL: area => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(area.latitude + ',' + area.longitude),
    publicLink: function (key, value) {
      const hosts = {google:['www.google.com','google.com','maps.google.com','maps.app.goo.gl','g.page'],getyourguide:['www.getyourguide.com','getyourguide.com'],viator:['www.viator.com','viator.com']};
      if (!Object.hasOwn(hosts,key) || !value) return null;
      try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password && hosts[key].includes(u.hostname) ? u.href : null; } catch { return null; }
    }
  };
});
