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

/**
 * UUID for client id. crypto.randomUUID() is secure-context-only (HTTPS /
 * localhost); `vite --host` over http://LAN throws and white-screens the app
 * during module init. getRandomValues works on non-secure contexts.
 */
function newClientId(): string {
    try {
        if (typeof crypto.randomUUID === "function") {
            return crypto.randomUUID();
        }
    } catch {
        // Non-secure context may expose randomUUID but still reject.
    }
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    // RFC 4122 version 4 bits
    bytes[6] = (bytes[6]! & 0x0f) | 0x40;
    bytes[8] = (bytes[8]! & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return (
        hex.slice(0, 8) +
        "-" +
        hex.slice(8, 12) +
        "-" +
        hex.slice(12, 16) +
        "-" +
        hex.slice(16, 20) +
        "-" +
        hex.slice(20)
    );
}

function ensureClientId(): string {
    const existing = readStorage("mathwars_client");
    // Treat empty string as missing (corrupt storage).
    if (existing) {
        return existing;
    }
    const id = newClientId();
    writeStorage("mathwars_client", id);
    return id;
}

export const idUsuario: string = ensureClientId();

export const usernameStore = writable("");

/**
 * Align with match decode (src/lib/match.ts MAX_NAME_LENGTH). Longer names
 * encode fine but shared result links fail isMatch and look "invalid".
 */
const MAX_NAME_LENGTH = 64

/** Trim and cap length. Empty / whitespace-only → null (missing). */
function normalizeDisplayName(raw: string | null | undefined): string | null {
    if (raw == null) return null
    const name = raw.trim().slice(0, MAX_NAME_LENGTH)
    return name.length > 0 ? name : null
}

function applyDisplayName(name: string): void {
    writeStorage("mathwars_name", name)
    usernameStore.set(name)
}

const storedName = normalizeDisplayName(readStorage("mathwars_name"))
if (storedName === null) {
    changeName()
} else {
    // Rewrite storage when corrupt (padding / oversize) so future loads stay clean.
    if (storedName !== readStorage("mathwars_name")) {
        writeStorage("mathwars_name", storedName)
    }
    usernameStore.set(storedName)
}

/**
 * Prompt for a display name. Cancel keeps the previous name when one exists;
 * on first visit with cancel, falls back to "Anônimo" so the UI does not hang.
 * Prefers the live store so a session-only name (storage blocked) is not wiped.
 * Names are capped so match result shares stay decodable.
 */
export function changeName() {
    const previous =
        normalizeDisplayName(get(usernameStore)) ||
        normalizeDisplayName(readStorage("mathwars_name"))

    while (true) {
        const raw = prompt("Digite seu nome para entrar em uma partida")
        if (raw === null) {
            if (previous) {
                applyDisplayName(previous)
                return
            }
            applyDisplayName("Anônimo")
            return
        }

        const name = normalizeDisplayName(raw)
        if (name) {
            applyDisplayName(name)
            return
        }
        // Empty input: re-prompt
    }
}
