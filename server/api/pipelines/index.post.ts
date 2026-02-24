import { db, schema } from '~~/server/db'
import { generateId } from '~~/server/utils/helpers'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body.projectId || !body.name) {
        throw createError({ statusCode: 400, statusMessage: 'projectId and name are required' })
    }

    const pipeline = await createPipeline({
        projectId: body.projectId,
        name: body.name,
        color: body.color,
    })

    return pipeline
})
