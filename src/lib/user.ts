import { writable } from "svelte/store";

if (localStorage.getItem('mathwars_client') == null) {
    localStorage.setItem('mathwars_client', crypto.randomUUID())
}

/**
 * A Svelte store holding the current user's display name.
 * Synchronized with localStorage ('mathwars_name').
 */
export const usernameStore = writable("")

if (localStorage.getItem('mathwars_name') === null) {
    changeName()
} else {
    usernameStore.set(localStorage.getItem('mathwars_name') || "")
}

/**
 * Prompts the user to enter a display name.
 * Persists the name to localStorage and updates `usernameStore`.
 * Loops until a non-empty name is provided.
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
 * The unique identifier for the current client (device/browser).
 * Generated once and stored in localStorage ('mathwars_client').
 */
export const idUsuario = localStorage.getItem('mathwars_client')

