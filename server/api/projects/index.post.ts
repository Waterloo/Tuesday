import { db, schema } from '~~/server/db'
import { generateId, now } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body.name) {
        throw createError({ statusCode: 400, statusMessage: 'Project name is required' })
    }

    const project = await createProject({
        name: body.name,
        description: body.description,
        color: body.color,
    })

    return project
})
