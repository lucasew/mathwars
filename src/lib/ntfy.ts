import { idUsuario } from "./user";

export function getNtfyTopic(topic: string) {
    console.log("NTFY", topic)
    async function send(text: string) {
        const res = await fetch(`https://ntfy.sh/${topic}`, {
            method: 'POST',
            body: JSON.stringify({
                text,
                uuid: idUsuario
            })
        })
    }
    async function subscribe(callback: (message: string) => any) {
        const wsUrl = `ws://ntfy.sh/${topic}/ws`;
        console.log(`'${wsUrl}'`)
        const ws = new WebSocket(wsUrl);
        ws.addEventListener('message', (messageEvent: MessageEvent) => {
            console.log("NTFY", messageEvent)
            const { event, message } = JSON.parse(messageEvent.data);
            if (event === 'message') {
                try {
                    const { uuid, text } = JSON.parse(message)
                    if (uuid === idUsuario) {
                        return;
                    }
                    console.log("NTFY", text)
                    callback(text)
                } catch (e) {
                    console.error(e)
                }
            }
        })
        return () => ws.close()
    }
    return {
        send,
        subscribe
    }
}