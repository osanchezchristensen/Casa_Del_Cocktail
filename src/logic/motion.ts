// Motion helper (docs/motion.md). CSS animations use @media (prefers-reduced-motion) instead.

/** True when the device's "reduce motion" setting is on. False when there is no browser (tests). */
export function prefersReducedMotion(): boolean {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

/** Count and burst: the count-up waits for the pop, then runs for this long (ms). */
export const COUNT_DELAY = 300
export const COUNT_DURATION = 700

/** The number the Unlock badge shows `elapsed` ms after it appears: 0 up to `target`, easing out, never past it. */
export function countAt(elapsed: number, target: number): number {
  const t = Math.min(Math.max((elapsed - COUNT_DELAY) / COUNT_DURATION, 0), 1)
  return Math.round(target * (1 - (1 - t) ** 3))
}
