// Lightweight analytics stub. In production this would push to GA4/GTM or a
// product analytics tool. Here it records events so the funnel can be demoed.
type EventProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: string, props: EventProps = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...props });

  if (process.env.NODE_ENV === "development") {
    console.info("[track]", event, props);
  }
}
