import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')!

    const project = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).get()

    if (!project) {
        throw createError({ statusCode: 404, statusMessage: 'Project not found' })
    }

    const projectPipelines = await db
        .select()
        .from(schema.pipelines)
        .where(eq(schema.pipelines.projectId, id))
        .orderBy(schema.pipelines.order)

    const projectTasks = await db
        .select()
        .from(schema.tasks)
        .where(eq(schema.tasks.projectId, id))
        .orderBy(schema.tasks.createdAt)

    return {
        ...project,
        pipelines: projectPipelines,
        tasks: projectTasks,
    }
})
