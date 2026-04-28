import { timelineEvents } from './timelineEvents';

const xs = timelineEvents.map((e) => e.x);

/** First / last event times (UTC ms). */
export const TIMELINE_DATA_MIN = Math.min(...xs);
export const TIMELINE_DATA_MAX = Math.max(...xs);

/** Pad edges so first/last points are not flush against the axis. */
export function getTimelineDomain(): { min: number; max: number } {
  const span = TIMELINE_DATA_MAX - TIMELINE_DATA_MIN;
  const pad = Math.max(span * 0.04, 120 * 24 * 60 * 60 * 1000);
  return {
    min: TIMELINE_DATA_MIN - pad,
    max: TIMELINE_DATA_MAX + pad,
  };
}

/** Minimum visible window (~10 weeks) so the chart never collapses. */
export const TIMELINE_MIN_SPAN_MS = 70 * 24 * 60 * 60 * 1000;

export function clampTimelineRange(
  start: number,
  end: number,
  domain: { min: number; max: number },
): [number, number] {
  const { min: d0, max: d1 } = domain;
  const minSpan = Math.min(TIMELINE_MIN_SPAN_MS, d1 - d0);
  let s = start;
  let e = end;
  if (e < s) [s, e] = [e, s];
  s = Math.max(d0, s);
  e = Math.min(d1, e);
  if (e - s < minSpan) {
    const mid = (s + e) / 2;
    s = mid - minSpan / 2;
    e = mid + minSpan / 2;
  }
  if (s < d0) {
    s = d0;
    e = Math.min(d1, s + minSpan);
  }
  if (e > d1) {
    e = d1;
    s = Math.max(d0, e - minSpan);
  }
  return [s, e];
}

/** Keeps the same visible duration but centers the window on an event (for marker navigation). */
export function centerRangeOnMarker(
  eventMs: number,
  spanMs: number,
  domain: { min: number; max: number },
): [number, number] {
  const half = spanMs / 2;
  return clampTimelineRange(eventMs - half, eventMs + half, domain);
}
