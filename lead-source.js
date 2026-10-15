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

  function valid(record, now) {
    if (!record || !sources.has(record.source) || !Number.isFinite(record.time) ||
        record.time > now || now - record.time >= lifetime) return null;
    const page = typeof record.page === 'string' && /^\/(?:[a-z0-9/_-]+\.html)?$/i.test(record.page) && record.page.length <= 160 ? record.page : '/';
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
