/* Accessible photo stories and progressively enhanced package browsing. */
'use strict';
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-carousel]').forEach(root => {
    const slides = [...root.querySelectorAll('[data-slide]')];
    if (slides.length < 2) return;
    const controls = root.querySelector('.story-controls');
    controls.hidden = false;
    const pause = root.querySelector('[data-pause]');
    const counter = root.querySelector('[data-counter]');
    const announcement = root.querySelector('[data-announcement]');
    const visibleCaption = root.querySelector('[data-visible-caption]');
    const dots = [...root.querySelectorAll('[data-slide-to]')];
    let index = 0, timer = null, userPaused = reduce.matches;
    let visible = !('IntersectionObserver' in window), hover = false, focus = false, explicitPlay = false;
    function stop() { if (timer !== null) window.clearInterval(timer); timer = null; }
    function playback() {
      stop();
      const running = visible && !document.hidden && !userPaused && ((!hover && !focus) || explicitPlay) && !reduce.matches;
      root.classList.toggle('is-stopped', !running);
      pause.textContent = reduce.matches ? 'Motion off' : userPaused ? 'Play story' : 'Pause story';
      pause.disabled = reduce.matches;
      pause.setAttribute('aria-pressed', String(userPaused || reduce.matches));
      if (running) timer = window.setInterval(() => show(index + 1, false), 7000);
    }
    function show(next, manual) {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, n) => {
        slide.classList.toggle('is-active', n === index);
        slide.setAttribute('aria-hidden', String(n !== index));
        slide.inert = n !== index;
      });
      dots.forEach((dot, n) => dot.setAttribute('aria-pressed', String(n === index)));
      counter.textContent = String(index + 1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
      if (visibleCaption) visibleCaption.textContent = slides[index].querySelector('figcaption')?.textContent.trim() || '';
      if (manual && announcement) announcement.textContent = slides[index].querySelector('figcaption')?.textContent.trim() || 'Photo '+(index+1);
    }
    root.querySelector('[data-prev]').addEventListener('click', () => { show(index - 1, true); playback(); });
    root.querySelector('[data-next]').addEventListener('click', () => { show(index + 1, true); playback(); });
    dots.forEach(dot => dot.addEventListener('click', () => { show(Number(dot.dataset.slideTo), true); playback(); }));
    pause.addEventListener('click', () => {
      if (reduce.matches) {
        // Respect the visitor's system setting: next/previous remain available.
        if (announcement) announcement.textContent = 'Automatic motion is disabled by your reduced-motion setting. Use the next and previous buttons to explore.';
        return;
      }
      userPaused = !userPaused;
      explicitPlay = !userPaused;
      playback();
    });
    root.addEventListener('mouseenter', () => { hover = true; explicitPlay = false; playback(); });
    root.addEventListener('mouseleave', () => { hover = false; playback(); });
    root.addEventListener('focusin', () => { focus = true; userPaused = true; explicitPlay = false; playback(); });
    root.addEventListener('focusout', event => { if (!root.contains(event.relatedTarget)) { focus = false; playback(); } });
    root.addEventListener('keydown', event => {
      if (event.target.closest('input,select,textarea')) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); show(index + (event.key === 'ArrowRight' ? 1 : -1), true); playback();
      }
    });
    let touchStart = null;
    root.addEventListener('touchstart', event => {
      if (event.touches.length !== 1 || event.target.closest('button,a,input,select,textarea')) return;
      touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }, { passive: true });
    root.addEventListener('touchend', event => {
      if (!touchStart || !event.changedTouches.length) return;
      const x = event.changedTouches[0].clientX - touchStart.x;
      const y = event.changedTouches[0].clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(x) > 55 && Math.abs(x) > Math.abs(y) * 1.5) {
        userPaused = true;
        explicitPlay = false;
        show(index + (x < 0 ? 1 : -1), true);
        playback();
      }
    }, { passive: true });
    document.addEventListener('visibilitychange', playback);
    reduce.addEventListener('change', () => { if (reduce.matches) userPaused = true; playback(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { visible = entries[0].isIntersecting; playback(); }, {threshold:0.12}).observe(root);
    }
    show(0, false); playback();
  });

  document.querySelectorAll('[data-story-tabs]').forEach(tablist => {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    function select(tab, moveFocus) {
      tabs.forEach(item => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1;
        document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
      });
      if (moveFocus) tab.focus();
    }
    tabs.forEach(tab => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', event => {
        const n = tabs.indexOf(tab);
        let next;
        if (event.key === 'ArrowRight') next = (n + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (n + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); select(tabs[next], true); }
      });
    });
    tablist.hidden = false;
    select(tabs[0], false);
  });

  const tours = window.DavidTours;
  const catalogue = document.querySelector('[data-catalogue]');
  if (catalogue && tours) {
    const filters = document.querySelector('#package-filters');
    filters.hidden = false;
    document.querySelector('#reset-packages').hidden = false;
    filters.addEventListener('submit', event => event.preventDefault());
    const count = document.querySelector('#package-count');
    const empty = document.querySelector('#package-empty');
    const read = id => document.getElementById(id).value;
    function apply() {
      const matches = new Set(tours.filterTours({query:read('package-search'),category:read('package-category'),length:read('package-length'),budget:read('package-budget')}).map(tour => tour.id));
      catalogue.querySelectorAll('[data-tour-id]').forEach(card => { card.hidden = !matches.has(card.dataset.tourId); });
      count.textContent = matches.size+' '+(matches.size === 1 ? 'journey' : 'journeys')+' to explore';
      empty.hidden = matches.size !== 0;
    }
    const query = new URLSearchParams(window.location.search);
    ['category','budget','length'].forEach(key => {
      const field = document.getElementById('package-'+key);
      if ([...field.options].some(option => option.value === query.get(key))) field.value = query.get(key);
    });
    filters.addEventListener('input', apply);
    filters.addEventListener('change', apply);
    document.querySelector('#reset-packages').addEventListener('click', () => { filters.querySelectorAll('input').forEach(input => {input.value='';}); filters.querySelectorAll('select').forEach(select => {select.selectedIndex=0;}); apply(); });
    apply();
  }

  const inquiry = document.querySelector('#trip-inquiry-form');
  if (inquiry && tours && document.querySelector('#trip-package')) {
    const field = document.querySelector('#trip-package');
    const managed = ['trip-destination', 'trip-duration', 'trip-style', 'trip-message'];
    const edited = new Set();
    const original = Object.fromEntries(managed.map(id => [id, document.getElementById(id).value]));
    let applied = {};
    managed.forEach(id => {
      const input = document.getElementById(id);
      input.addEventListener('input', () => edited.add(id));
      input.addEventListener('change', () => edited.add(id));
    });
    function update(id, value) {
      const input = document.getElementById(id);
      if (edited.has(id) || (applied[id] !== undefined && input.value !== applied[id])) return;
      input.value = value;
      applied[id] = value;
    }
    function choose(id) {
      const preset = tours.requestPreset(id);
      if (!preset) {
        managed.forEach(key => update(key, original[key]));
        return;
      }
      update('trip-destination', preset.destination);
      update('trip-duration', preset.duration);
      update('trip-style', tours.getTour(id).style.startsWith('Private') ? 'Private journey' : 'Help me decide');
      update('trip-message', preset.message);
      // The pricing party is an estimate basis, never the customer's party size.
    }
    const selected = new URLSearchParams(window.location.search).get('package');
    if (tours.getTour(selected)) { field.value = selected; choose(selected); }
    field.addEventListener('change', () => choose(field.value));
  }
})();
