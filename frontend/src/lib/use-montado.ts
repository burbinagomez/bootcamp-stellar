import { useSyncExternalStore } from "react";

const sinSuscripcion = () => () => {};

/**
 * False on the server and during hydration, true afterwards.
 * Gate anything that reads the clock or `window` so prerender and hydration stay deterministic.
 */
export function useMontado(): boolean {
  return useSyncExternalStore(
    sinSuscripcion,
    () => true,
    () => false,
  );
}
