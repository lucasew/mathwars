import { writable } from "svelte/store";

if (localStorage.getItem('mathwars_client') == null) {
    localStorage.setItem('mathwars_client', crypto.randomUUID())
}

/**
 * Writable Svelte store maintaining the active username for real-time reactivity.
 * Subscribing via `$usernameStore` provides automatic UI updates.
 * Hydrated from `localStorage` ('mathwars_name') on load, or prompted if unavailable.
 */
export const usernameStore = writable("")

if (localStorage.getItem('mathwars_name') === null) {
    changeName()
} else {
    usernameStore.set(localStorage.getItem('mathwars_name') || "")
}

/**
 * Forces a prompt blocking execution until the user sets a valid name.
 * Syncs the provided name into `localStorage` and updates the `usernameStore` state.
 * Required for valid presence in multiplayer mode and accurate play stats.
 */
export function changeName() {
    let name;
    while (!name) {
        name = prompt("Digite seu nome para entrar em uma partida")
    }
    localStorage.setItem('mathwars_name', name)
    usernameStore.set(name)
}



/**
 * Unique identifier per browser installation generated during initialization via `crypto.randomUUID()`.
 * Maintained in `localStorage` to distinguish players within WebSocket Pub/Sub messages over ntfy.sh.
 * It prevents echo-loops by verifying payload origins.
 */
export const idUsuario = localStorage.getItem('mathwars_client')

