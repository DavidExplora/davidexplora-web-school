/* Progressive enhancements: manual tour sliders and consistent navigation. */
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
    rail.querySelector('.rail-buttons').hidden = false;
    const maximum = () => Math.max(0, track.scrollWidth - track.clientWidth);
    function state() {
      const left = track.getBoundingClientRect().left;
      const first = Math.max(0, cards.findIndex(card => card.getBoundingClientRect().right > left + 8));
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= maximum() - 2;
      position.textContent = String(first + 1).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0');
    }
    function move(direction) {
      const step = cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
      const left = Math.max(0, Math.min(maximum(), track.scrollLeft + direction * step));
      track.scrollTo({ left, behavior: reduced.matches ? 'auto' : 'smooth' });
      status.textContent = direction > 0 ? 'Showing later tours. Each card includes an itinerary and quote link.' : 'Showing earlier tours.';
    }
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', state, { passive: true });
    track.addEventListener('keydown', event => {
      if (event.target !== track) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
      }
      if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        track.scrollTo({ left: event.key === 'Home' ? 0 : maximum(), behavior: reduced.matches ? 'auto' : 'smooth' });
      }
    });
    window.addEventListener('resize', state);
    if ('ResizeObserver' in window) new ResizeObserver(state).observe(track);
    state();
  });

  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    if (link.getAttribute('href') === page) link.setAttribute('aria-current', 'page');
  });
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  window.matchMedia('(min-width: 1181px)').addEventListener('change', event => {
    if (event.matches) {
      nav?.classList.remove('is-open');
      menu?.setAttribute('aria-expanded', 'false');
      menu?.setAttribute('aria-label', 'Open navigation');
    }
  });
})();
