// Browser half of the backbone: every tool submits leads and funnel events
// through these two functions, so the routine is identical across tools.

const UTM_KEY = 'lk_tool_utm';

function captureUtm() {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    params.forEach((v, k) => { if (k.startsWith('utm_')) utm[k] = v; });
    if (Object.keys(utm).length) sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
    return Object.keys(utm).length ? utm : JSON.parse(sessionStorage.getItem(UTM_KEY) || 'null');
  } catch {
    return null;
  }
}

// Untyped handle on window for the analytics globals (types live in src/lib/events.ts).
const w = () => /** @type {any} */ (typeof window !== 'undefined' ? window : {});

function newEventId() {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Send a lead to /api/ferramentas/<tool>/lead. The server stores it, generates
 * the AI plan, sends the WhatsApp report and the Meta CAPI Lead event. The
 * browser pixel fires the same Lead with a shared event_id so Meta dedupes.
 */
export async function submitLead(tool, payload, pixelData = {}) {
  const eventId = newEventId();
  const g = w();
  if (typeof g.fbq === 'function') {
    g.fbq('track', 'Lead', { content_name: tool, ...pixelData }, { eventID: eventId });
  }
  g.dataLayer = g.dataLayer || [];
  g.dataLayer.push({ event: 'tool_lead', tool });

  try {
    const res = await fetch(`/api/ferramentas/${tool}/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        _meta: { eventId, pageUrl: window.location.href, utm: captureUtm() },
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!data.messageSent) console.warn(`[${tool}] WhatsApp report not sent:`, data.whatsappError || data.error);
    return data;
  } catch (err) {
    console.error(`[${tool}] lead submission failed:`, err);
    return { success: false };
  }
}

/** Funnel events (PageView, ViewContent…) via the shared server-side CAPI proxy. */
export function trackEvent(eventName, customData = {}) {
  const eventId = newEventId();
  const g = w();
  if (typeof g.fbq === 'function') {
    g.fbq('track', eventName, customData, { eventID: eventId });
  }
  const cookie = (name) => {
    const m = document.cookie.match(new RegExp(`${name}=([^;]+)`));
    return m ? m[1] : undefined;
  };
  fetch('/api/ferramentas/capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [{
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        user_data: { fbc: cookie('_fbc'), fbp: cookie('_fbp') },
        custom_data: customData,
      }],
    }),
  }).catch(() => {});
}

// Capture UTMs on first load so they survive the multi-step funnel.
if (typeof window !== 'undefined') captureUtm();
