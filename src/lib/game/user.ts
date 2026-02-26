import { writable } from "svelte/store";

if (localStorage.getItem('mathwars_client') == null) {
    localStorage.setItem('mathwars_client', crypto.randomUUID())
}

export const usernameStore = writable("")

if (localStorage.getItem('mathwars_name') === null) {
    changeName()
} else {
    usernameStore.set(localStorage.getItem('mathwars_name') || "")
}

export function changeName() {
    let name;
    while (!name) {
        name = prompt("Digite seu nome para entrar em uma partida")
    }
    localStorage.setItem('mathwars_name', name)
    usernameStore.set(name)
}



export const idUsuario = localStorage.getItem('mathwars_client')

