import { writable } from "svelte/store";

export default {
    decay: writable(256),
    wind: writable(1.5)
}