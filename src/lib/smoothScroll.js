/**
 * Lightweight smooth-scroll helper inspired by scrollToSmooth.
 * Used only for the contact terminal navigation — not site-wide.
 */

const EASINGS = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => 1 - (1 - t) * (1 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  easeInOutBack: (t) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
};

let activeFrame = 0;

function resolveDuration(distance, { duration, durationRelative, durationMin, durationMax }) {
  let ms = duration;
  if (durationRelative) {
    const per = typeof durationRelative === "number" ? durationRelative : 1000;
    ms = (Math.abs(distance) / per) * duration;
  }
  if (typeof durationMin === "number") ms = Math.max(durationMin, ms);
  if (typeof durationMax === "number") ms = Math.min(durationMax, ms);
  return Math.max(0, ms);
}

/**
 * Animate `container.scrollTop` to `to` with easing.
 * @returns {() => void} cancel function
 */
export function smoothScrollTo(container, to, options = {}) {
  const {
    duration = 800,
    durationRelative = true,
    durationMin = 400,
    durationMax = 1600,
    easing = "easeInOutBack",
    onScrollStart = null,
    onScrollUpdate = null,
    onScrollEnd = null,
  } = options;

  if (!container) return () => {};

  if (activeFrame) {
    cancelAnimationFrame(activeFrame);
    activeFrame = 0;
  }

  const from = container.scrollTop;
  const max = Math.max(0, container.scrollHeight - container.clientHeight);
  const target = Math.max(0, Math.min(to, max));
  const distance = target - from;

  if (Math.abs(distance) < 1) {
    container.scrollTop = target;
    onScrollEnd?.({ startPos: from, currentPos: target, endPos: target, progress: 1 });
    return () => {};
  }

  const ease = EASINGS[easing] ?? EASINGS.easeInOutCubic;
  const ms = resolveDuration(distance, { duration, durationRelative, durationMin, durationMax });
  const startTime = performance.now();

  const data = (progress, currentPos) => ({
    startPos: from,
    currentPos,
    endPos: target,
    progress,
  });

  onScrollStart?.(data(0, from));

  let cancelled = false;

  const tick = (now) => {
    if (cancelled) return;

    const elapsed = now - startTime;
    const progress = ms <= 0 ? 1 : Math.min(1, elapsed / ms);
    const currentPos = from + distance * ease(progress);
    container.scrollTop = currentPos;
    onScrollUpdate?.(data(progress, currentPos));

    if (progress < 1) {
      activeFrame = requestAnimationFrame(tick);
      return;
    }

    container.scrollTop = target;
    activeFrame = 0;
    onScrollEnd?.(data(1, target));
  };

  activeFrame = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    if (activeFrame) {
      cancelAnimationFrame(activeFrame);
      activeFrame = 0;
    }
  };
}

/** Map linear 0–1 progress through an easing curve (for scroll-linked UI). */
export function easeProgress(progress, easing = "easeInOutCubic") {
  const t = Math.min(1, Math.max(0, progress));
  const ease = EASINGS[easing] ?? EASINGS.easeInOutCubic;
  return ease(t);
}
