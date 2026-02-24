import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')!

    const task = await db.select().from(schema.tasks).where(eq(schema.tasks.id, id)).get()
    if (!task) {
        throw createError({ statusCode: 404, statusMessage: 'Task not found' })
    }

    // Get subtasks
    const subtasks = await db
        .select()
        .from(schema.tasks)
        .where(eq(schema.tasks.parentId, id))
        .orderBy(schema.tasks.createdAt)

    return { ...task, subtasks }
})
