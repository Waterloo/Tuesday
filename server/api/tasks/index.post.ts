import { db, schema } from '~~/server/db'
import { generateId, now } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body.projectId || !body.pipelineId || !body.title) {
        throw createError({ statusCode: 400, statusMessage: 'projectId, pipelineId, and title are required' })
    }

    const task = await createTask({
        projectId: body.projectId,
        pipelineId: body.pipelineId,
        title: body.title,
        description: body.description,
        priority: body.priority,
        assignee: body.assignee,
        parentId: body.parentId,
    })

    return task
})
