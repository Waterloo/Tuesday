import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const updated = await updatePipeline(id, body)
    return updated
})
