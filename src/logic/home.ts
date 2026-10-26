// Small helpers for the Home screen. No React here.

/** One item from the list, chosen by a seed from 0 up to (not including) 1. Empty list → undefined. */
export function pickTonight<T>(list: T[], seed: number): T | undefined {
  return list[Math.min(Math.floor(seed * list.length), list.length - 1)]
}
