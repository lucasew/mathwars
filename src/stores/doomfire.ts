import { writable } from "svelte/store";

export const DEFAULT_DECAY = 256;
export const DEFAULT_WIND = 1.5;

export const decay = writable(DEFAULT_DECAY);
export const wind = writable(DEFAULT_WIND);
