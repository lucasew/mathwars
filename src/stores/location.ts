import { derived, writable } from "svelte/store";

/**
 * Creates a reactive store for the current window location.
 *
 * @remarks
 * This function monkey-patches `history.pushState` and `history.replaceState`
 * to ensure the store updates on all navigation events (SPA routing).
 * It also listens to standard `popstate` and `hashchange` events.
 *
 * @returns A derived store that emits a new `URL` object whenever the location changes.
 */
export function createUrlStore() {
  const href = writable(window.location.href);

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  const updateHref = () => {
    return href.set(window.location.href);
  };

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    updateHref();
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    updateHref();
  };

  window.addEventListener("popstate", updateHref);
  window.addEventListener("hashchange", updateHref);

  return derived(href, ($href) => new URL($href))
}

/**
 * Returns a function to programmatically navigate to a route.
 *
 * @param route - The destination path (e.g., "/about").
 * @returns A function suitable for event handlers (e.g., `onclick`).
 */
export function handleJump(route: string) {
    return () => history.pushState({}, '', route)
}

const locationStore = createUrlStore();

history.replaceState({}, '', window.location.href)

export default locationStore;
