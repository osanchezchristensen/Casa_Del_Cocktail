// Motion helper (docs/motion.md). CSS animations use @media (prefers-reduced-motion) instead.

/** True when the device's "reduce motion" setting is on. False when there is no browser (tests). */
export function prefersReducedMotion(): boolean {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}
