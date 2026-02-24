import { db, schema } from '~~/server/db'
import { generateId } from '~~/server/utils/helpers'
import { eq } from 'drizzle-orm'

export const createPipeline = async (data: { projectId: string; name: string; color?: string }) => {
    // Get highest order
    const existingPipelines = await db
        .select()
        .from(schema.pipelines)
        .where(eq(schema.pipelines.projectId, data.projectId))
        .orderBy(schema.pipelines.order)

    const maxOrder = existingPipelines.length > 0 ? Math.max(...existingPipelines.map(p => p.order)) : -1

    const pipeline = {
        id: generateId(),
        projectId: data.projectId,
        name: data.name,
        color: data.color || '#E2E8F0',
        order: maxOrder + 1,
    }

    await db.insert(schema.pipelines).values(pipeline)
    broadcast({ type: 'pipeline-created', projectId: data.projectId, pipeline })
    return pipeline
}

export const updatePipeline = async (id: string, data: { name?: string; color?: string; order?: number }) => {
    const existing = await db.select().from(schema.pipelines).where(eq(schema.pipelines.id, id)).get()
    if (!existing) return null

    const updates: Record<string, any> = {}
    if (data.name !== undefined) updates.name = data.name
    if (data.color !== undefined) updates.color = data.color
    if (data.order !== undefined) updates.order = data.order

    await db.update(schema.pipelines).set(updates).where(eq(schema.pipelines.id, id))
    const updated = await db.select().from(schema.pipelines).where(eq(schema.pipelines.id, id)).get()

    broadcast({ type: 'pipeline-updated', projectId: existing.projectId, pipeline: updated })
    return updated
}

export const deletePipeline = async (id: string) => {
    const existing = await db.select().from(schema.pipelines).where(eq(schema.pipelines.id, id)).get()
    if (!existing) return false

    await db.delete(schema.tasks).where(eq(schema.tasks.pipelineId, id))
    await db.delete(schema.pipelines).where(eq(schema.pipelines.id, id))

    broadcast({ type: 'pipeline-deleted', projectId: existing.projectId, pipelineId: id })
    return true
}
