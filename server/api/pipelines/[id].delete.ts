import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')!

    const success = await deletePipeline(id)
    if (!success) {
        throw createError({ statusCode: 404, statusMessage: 'Pipeline not found' })
    }

    return { success: true }
})
