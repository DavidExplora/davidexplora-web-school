/* Owner-supplied tawk.to widget; local previews retain the WhatsApp fallback. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DavidLiveChat = api.install(root, root.document);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const embedURL = 'https://embed.tawk.to/6acfc0086fd69f34cebb33c5/1k4toc8sl';
  const hosts = new Set(['davidexplora.com', 'www.davidexplora.com', 'david-explora.fastash16.chatgpt.site']);

  function install(root, doc) {
    if (root.DavidLiveChat?.installed) return root.DavidLiveChat;
    const state = { installed: false, ready: false, failed: false };
    if (!doc || root.location?.protocol !== 'https:' || !hosts.has(root.location.hostname)) return state;
    if (doc.getElementById('david-live-chat-script')) return state;
    state.installed = true;
    root.DavidLiveChat = state;
    const api = root.Tawk_API = root.Tawk_API || {};
    root.Tawk_LoadStart = new Date();
    api.customStyle = api.customStyle || { zIndex: 45 };
    const previousLoad = api.onLoad;
    const launcher = doc.getElementById('welcome-launch');
    const welcome = doc.getElementById('david-welcome');
    let heldForFocus = false;

    function fallbackHasFocus() {
      return (!!launcher && doc.activeElement === launcher) || !!welcome?.contains(doc.activeElement);
    }
    function handoff() {
      if (fallbackHasFocus()) return;
      state.ready = true;
      doc.body.classList.add('live-chat-ready');
      if (welcome) welcome.hidden = true;
      if (launcher) {
        launcher.hidden = true;
        launcher.setAttribute('aria-expanded', 'false');
      }
      doc.removeEventListener('focusin', handoff);
      if (heldForFocus && typeof api.showWidget === 'function') api.showWidget();
      heldForFocus = false;
    }
    api.onLoad = function (...args) {
      try {
        if (typeof previousLoad === 'function') previousLoad.apply(this, args);
      } finally {
        // Keep an existing keyboard conversation usable until focus moves away.
        if (fallbackHasFocus()) {
          if (typeof api.hideWidget === 'function') {
            api.hideWidget();
            heldForFocus = true;
          }
          doc.addEventListener('focusin', handoff);
        } else handoff();
      }
    };

    const script = doc.createElement('script');
    script.id = 'david-live-chat-script';
    script.async = true;
    script.src = embedURL;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', 'anonymous');
    script.onerror = () => { state.failed = true; };
    // Never set visitor attributes or copy values from the trip/support forms.
    doc.head.appendChild(script);
    return state;
  }
  return { install, embedURL };
});
