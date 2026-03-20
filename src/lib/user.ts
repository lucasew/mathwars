import { writable } from "svelte/store";

if (localStorage.getItem('mathwars_client') == null) {
    localStorage.setItem('mathwars_client', crypto.randomUUID())
}

/**
 * Svelte store that reacts to the player's username.
 *
 * It is initialized from localStorage `mathwars_name` to keep the user's
 * identity persistent across sessions without any backend authentication.
 */
export const usernameStore = writable("")

if (localStorage.getItem('mathwars_name') === null) {
    changeName()
} else {
    usernameStore.set(localStorage.getItem('mathwars_name') || "")
}

/**
 * Prompts the user to change or initialize their username.
 *
 * Ensures an active name is present by looping the prompt until a value is given.
 * Persists the chosen string into localStorage under `mathwars_name` and updates
 * the reactive `usernameStore` so the app UI can update automatically.
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
 * A persistent unique identifier (UUID) for this specific browser/client.
 *
 * This ID is generated using `crypto.randomUUID()` on the first visit
 * and acts as a device fingerprint in `localStorage` (`mathwars_client`).
 * Essential for the multiplayer pub/sub system to differentiate the local
 * client's own messages from those coming from other players.
 */
export const idUsuario = localStorage.getItem('mathwars_client')

