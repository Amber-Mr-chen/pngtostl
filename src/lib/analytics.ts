export type AnalyticsEventName =
  | "homepage_view_examples_click"
  | "samples_filter_click"
  | "sample_open_workflow_click"
  | "sample_download_click"
  | "converter_generate_success"
  | "converter_download_click"
  | "feedback_panel_open"
  | "feedback_panel_close"
  | "feedback_email_click"
  | "feedback_contact_click";

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, payload?: AnalyticsPayload) => void;
    dataLayer?: unknown[];
    pngtostlEvents?: Array<{ event: AnalyticsEventName; payload: AnalyticsPayload; ts: number }>;
  }
}

export function trackEvent(event: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  ) as AnalyticsPayload;

  window.pngtostlEvents = window.pngtostlEvents ?? [];
  window.pngtostlEvents.push({ event, payload: cleanPayload, ts: Date.now() });

  if (typeof window.gtag === "function") {
    window.gtag("event", event, cleanPayload);
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...cleanPayload });
  }
}
