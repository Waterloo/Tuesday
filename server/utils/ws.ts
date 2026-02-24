import type { Peer } from 'crossws'

const peers = new Set<Peer>()

export function joinPeer(peer: Peer) {
    peers.add(peer)
}

export function leavePeer(peer: Peer) {
    peers.delete(peer)
}

export function broadcast(message: any) {
    const msg = JSON.stringify(message)
    for (const peer of peers) {
        try {
            peer.send(msg)
        } catch (e) {
            // Ignore errors for disconnected peers
            peers.delete(peer)
        }
    }
}
