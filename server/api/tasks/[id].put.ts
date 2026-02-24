import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'
import { now } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const updated = await updateTask(id, body)
    if (!updated) {
        throw createError({ statusCode: 404, statusMessage: 'Task not found' })
    }
    return updated
})
