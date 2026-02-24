import { randomUUID } from 'crypto'

export function generateId(): string {
    return randomUUID().slice(0, 8)
}

export function now(): string {
    return new Date().toISOString()
}
