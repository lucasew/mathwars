import { derived, writable } from "svelte/store";

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
export function handleJump(route: string) {
    return () => history.pushState({}, '', route)
}

const locationStore = createUrlStore();

history.replaceState({}, '', window.location.href)

export default locationStore;
