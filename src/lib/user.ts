import { get, writable } from "svelte/store";

/** localStorage can throw (private mode, disabled storage, quota). */
function readStorage(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeStorage(key: string, value: string): void {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Keep in-memory state only when persistence is unavailable.
    }
}

function ensureClientId(): string {
    const existing = readStorage("mathwars_client");
    if (existing !== null) {
        return existing;
    }
    const id = crypto.randomUUID();
    writeStorage("mathwars_client", id);
    return id;
}

export const idUsuario: string = ensureClientId();

export const usernameStore = writable("");

const storedName = readStorage("mathwars_name");
if (storedName === null) {
    changeName();
} else {
    usernameStore.set(storedName);
}

/**
 * Prompt for a display name. Cancel keeps the previous name when one exists;
 * on first visit with cancel, falls back to "Anônimo" so the UI does not hang.
 * Prefers the live store so a session-only name (storage blocked) is not wiped.
 */
export function changeName() {
    const previous =
        get(usernameStore).trim() || readStorage("mathwars_name");

    while (true) {
        const raw = prompt("Digite seu nome para entrar em uma partida");
        if (raw === null) {
            if (previous) {
                usernameStore.set(previous);
                return;
            }
            const fallback = "Anônimo";
            writeStorage("mathwars_name", fallback);
            usernameStore.set(fallback);
            return;
        }

        const name = raw.trim();
        if (name) {
            writeStorage("mathwars_name", name);
            usernameStore.set(name);
            return;
        }
        // Empty input: re-prompt
    }
}
