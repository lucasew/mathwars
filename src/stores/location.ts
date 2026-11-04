import { derived, writable } from "svelte/store";

/** Collapse trailing slashes so `/options/` matches App routes keyed on `/options`. */
function normalizePathname(pathname: string): string {
  if (pathname.length <= 1) return pathname
  return pathname.replace(/\/+$/, "") || "/"
}

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

  return derived(href, ($href) => {
    const url = new URL($href)
    const path = normalizePathname(url.pathname)
    if (path !== url.pathname) {
      url.pathname = path
    }
    return url
  })
}
export function handleJump(route: string) {
    return () => {
        const next = new URL(route, window.location.href)
        const path = normalizePathname(next.pathname)
        const search = next.search
        const hash = next.hash
        // Avoid stacking identical history entries (e.g. logo while already home).
        if (
            path === normalizePathname(window.location.pathname) &&
            search === window.location.search &&
            hash === window.location.hash
        ) {
            return
        }
        history.pushState({}, "", path + search + hash)
    }
}

const locationStore = createUrlStore();

history.replaceState({}, '', window.location.href)

export default locationStore;
