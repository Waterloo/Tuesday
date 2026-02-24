import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')!

    const success = await deleteProject(id)
    if (!success) {
        throw createError({ statusCode: 404, statusMessage: 'Project not found' })
    }

    return { success: true }
})
