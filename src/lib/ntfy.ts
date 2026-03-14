import { idUsuario } from "./user";

/**
 * Establishes a Pub/Sub communication channel over ntfy.sh using a specific topic.
 *
 * Provides methods to send stringified payloads and subscribe to incoming messages via WebSockets.
 * Messages originating from the current client (`idUsuario`) are filtered out automatically to prevent echo loops.
 *
 * @param topic - The target ntfy.sh topic ID used for isolated channel routing.
 */
export function getNtfyTopic(topic: string) {
    console.log("NTFY", topic)

    /**
     * Broadcasts a JSON-encoded payload to the ntfy.sh topic over HTTP POST.
     * Includes the current user's UUID to allow other clients to identify the sender.
     */
    async function send(text: string) {
        const res = await fetch(`https://ntfy.sh/${topic}`, {
            method: 'POST',
            body: JSON.stringify({
                text,
                uuid: idUsuario
            })
        })
    }
    /**
     * Opens a WebSocket connection to listen for new messages on the topic.
     *
     * Parses incoming JSON payloads and fires the callback only if the event is a 'message'
     * and the sender's UUID is different from the current client (`idUsuario`).
     *
     * @param callback - Function invoked with the text payload when a valid message is received.
     * @returns A cleanup function to close the active WebSocket connection.
     */
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