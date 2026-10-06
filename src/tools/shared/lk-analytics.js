// Analytics for the lead magnets: pushes events to window.dataLayer (GTM-P9RPPHD9 is loaded by the
// root layout) and calls gtag() when present. Elements with data-lk-event="…" are tracked on click.
// Never throws.

let delegated = false;

export function track(event, params = {}) {
  try {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
    if (typeof window.gtag === 'function') window.gtag('event', event, params);
  } catch {
    /* analytics must never break the page */
  }
}

export function installClickTracking() {
  if (delegated || typeof document === 'undefined') return;
  delegated = true;
  document.addEventListener('click', (e) => {
    const el = e.target && e.target.closest ? e.target.closest('[data-lk-event]') : null;
    if (!el) return;
    const p = {};
    for (const a of Array.from(el.attributes)) {
      if (a.name.startsWith('data-lk-') && a.name !== 'data-lk-event') p[a.name.slice(8).replace(/-/g, '_')] = a.value;
    }
    track(el.getAttribute('data-lk-event'), p);
  }, true);
}
