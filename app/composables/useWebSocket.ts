// Singleton state
let ws: WebSocket | null = null
let reconnectTimer: any = null
const listeners = new Set<(data: any) => void>()

export const useWebSocket = () => {
    const connect = () => {
        if (process.server || ws) return

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const url = `${protocol}//${window.location.host}/_ws`

        console.log('[ws] connecting to', url)
        ws = new WebSocket(url)

        ws.onopen = () => {
            console.log('[ws] connected')
            if (reconnectTimer) clearTimeout(reconnectTimer)
        }

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                // console.log('[ws] message', data)
                listeners.forEach(cb => cb(data))
            } catch (e) {
                console.error('[ws] error parsing message', e)
            }
        }

        ws.onclose = () => {
            console.log('[ws] closed, reconnecting...')
            ws = null
            reconnectTimer = setTimeout(connect, 2000)
        }

        ws.onerror = (err) => {
            console.error('[ws] error', err)
            ws?.close()
        }
    }

    const onMessage = (callback: (data: any) => void) => {
        listeners.add(callback)
        return () => listeners.delete(callback)
    }

    return {
        connect,
        onMessage
    }
}
