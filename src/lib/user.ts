import { writable } from "svelte/store";

function ensureClientId(): string {
    const existing = localStorage.getItem("mathwars_client");
    if (existing !== null) {
        return existing;
    }
    const id = crypto.randomUUID();
    localStorage.setItem("mathwars_client", id);
    return id;
}

export const idUsuario: string = ensureClientId();

export const usernameStore = writable("");

const storedName = localStorage.getItem("mathwars_name");
if (storedName === null) {
    changeName();
} else {
    usernameStore.set(storedName);
}

/**
 * Prompt for a display name. Cancel keeps the previous name when one exists;
 * on first visit with cancel, falls back to "Anônimo" so the UI does not hang.
 */
export function changeName() {
    const previous = localStorage.getItem("mathwars_name");

    while (true) {
        const raw = prompt("Digite seu nome para entrar em uma partida");
        if (raw === null) {
            if (previous !== null) {
                usernameStore.set(previous);
                return;
            }
            const fallback = "Anônimo";
            localStorage.setItem("mathwars_name", fallback);
            usernameStore.set(fallback);
            return;
        }

        const name = raw.trim();
        if (name) {
            localStorage.setItem("mathwars_name", name);
            usernameStore.set(name);
            return;
        }
        // Empty input: re-prompt
    }
}
