export default defineWebSocketHandler({
    open(peer) {
        console.log('[ws] open', peer)
        joinPeer(peer)
    },
    close(peer, details) {
        console.log('[ws] close', peer, details)
        leavePeer(peer)
    },
    error(peer, error) {
        console.log('[ws] error', peer, error)
        leavePeer(peer)
    },
    message(peer, message) {
        console.log('[ws] message', peer, message)
        // echo back if needed, or handle client messages
    },
})
