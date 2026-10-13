/* Progressive enhancements: tour sliders and consistent navigation. */
'use strict';
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-tour-rail]').forEach(rail => {
    const track = rail.querySelector('.tour-rail-track');
    const cards = [...track.querySelectorAll('.package-card')];
    if (cards.length < 2) return;
    const previous = rail.querySelector('[data-rail-prev]');
    const next = rail.querySelector('[data-rail-next]');
    const position = rail.querySelector('.rail-position');
    const status = rail.querySelector('[data-rail-status]');
    const pause = rail.querySelector('[data-rail-pause]');
    const automatic = Boolean(pause);
    let timer = null, userPaused = reduced.matches, hover = false, focused = false, explicitPlay = false;
    let visible = !('IntersectionObserver' in window);
    rail.querySelector('.rail-buttons').hidden = false;
    const maximum = () => Math.max(0, track.scrollWidth - track.clientWidth);
    function state() {
      const left = track.getBoundingClientRect().left;
      const first = Math.max(0, cards.findIndex(card => card.getBoundingClientRect().right > left + 8));
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= maximum() - 2;
      position.textContent = String(first + 1).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0');
    }
    function move(direction, auto = false) {
      const step = cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
      const left = auto && track.scrollLeft >= maximum() - 2 ? 0 : Math.max(0, Math.min(maximum(), track.scrollLeft + direction * step));
      track.scrollTo({ left, behavior: reduced.matches ? 'auto' : 'smooth' });
      if (!auto) status.textContent = direction > 0 ? 'Showing later tours. Each card includes an itinerary and quote link.' : 'Showing earlier tours.';
    }
    function playback() {
      if (!automatic) return;
      if (timer !== null) window.clearInterval(timer);
      timer = null;
      pause.textContent = reduced.matches ? 'Motion off' : userPaused ? 'Play tours' : 'Pause tours';
      pause.disabled = reduced.matches;
      pause.setAttribute('aria-pressed', String(userPaused || reduced.matches));
      if (visible && !document.hidden && !reduced.matches && !userPaused && ((!hover && !focused) || explicitPlay) && maximum() > 2) {
        timer = window.setInterval(() => move(1, true), 8000);
      }
    }
    function manual(direction) { userPaused = true; explicitPlay = false; move(direction); playback(); }
    previous.addEventListener('click', () => manual(-1));
    next.addEventListener('click', () => manual(1));
    track.addEventListener('scroll', state, { passive: true });
    track.addEventListener('keydown', event => {
      if (event.target !== track) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); manual(event.key === 'ArrowLeft' ? -1 : 1);
      }
      if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        userPaused = true; explicitPlay = false; playback();
        track.scrollTo({ left: event.key === 'Home' ? 0 : maximum(), behavior: reduced.matches ? 'auto' : 'smooth' });
      }
    });
    const refresh = () => { state(); playback(); };
    window.addEventListener('resize', refresh);
    if ('ResizeObserver' in window) new ResizeObserver(refresh).observe(track);
    if (automatic) {
      pause.addEventListener('click', () => { userPaused = !userPaused; explicitPlay = !userPaused; playback(); });
      rail.addEventListener('mouseenter', () => { hover = true; explicitPlay = false; playback(); });
      rail.addEventListener('mouseleave', () => { hover = false; playback(); });
      rail.addEventListener('focusin', event => {
        focused = true;
        // Focus stops movement; the playback button still toggles the existing state.
        if (event.target !== pause) { userPaused = true; explicitPlay = false; }
        playback();
      });
      rail.addEventListener('focusout', event => { if (!rail.contains(event.relatedTarget)) { focused = false; playback(); } });
      track.addEventListener('touchstart', () => { userPaused = true; explicitPlay = false; playback(); }, { passive: true });
      document.addEventListener('visibilitychange', playback);
      reduced.addEventListener('change', () => { if (reduced.matches) userPaused = true; playback(); });
      if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; playback(); }, {threshold:0.15}).observe(rail);
      playback();
    }
    state();
  });

  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    if (link.getAttribute('href') === page) link.setAttribute('aria-current', 'page');
  });
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  window.matchMedia('(min-width: 1301px)').addEventListener('change', event => {
    if (event.matches) {
      nav?.classList.remove('is-open');
      menu?.setAttribute('aria-expanded', 'false');
      menu?.setAttribute('aria-label', 'Open navigation');
    }
  });
})();
