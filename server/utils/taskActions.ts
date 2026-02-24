import { db, schema } from '~~/server/db'
import { generateId, now } from '~~/server/utils/helpers'
import { eq } from 'drizzle-orm'

export const createTask = async (data: {
    projectId: string;
    pipelineId: string;
    title: string;
    description?: string;
    priority?: string;
    assignee?: string;
    parentId?: string;
}) => {
    const timestamp = now()
    const task = {
        id: generateId(),
        projectId: data.projectId,
        pipelineId: data.pipelineId,
        parentId: data.parentId || null,
        title: data.title,
        description: data.description || '',
        priority: (data.priority || 'medium') as 'low' | 'medium' | 'high' | 'urgent',
        assignee: data.assignee || '',
        createdAt: timestamp,
        updatedAt: timestamp,
    }

    await db.insert(schema.tasks).values(task)
    broadcast({ type: 'task-created', projectId: data.projectId, task })
    return task
}

export const updateTask = async (id: string, data: {
    title?: string;
    description?: string;
    priority?: string;
    pipelineId?: string;
    parentId?: string;
    assignee?: string;
}) => {
    const existing = await db.select().from(schema.tasks).where(eq(schema.tasks.id, id)).get()
    if (!existing) return null

    const updates: Record<string, any> = { updatedAt: now() }
    if (data.title !== undefined) updates.title = data.title
    if (data.description !== undefined) updates.description = data.description
    if (data.priority !== undefined) updates.priority = data.priority
    if (data.pipelineId !== undefined) updates.pipelineId = data.pipelineId
    if (data.parentId !== undefined) updates.parentId = data.parentId
    if (data.assignee !== undefined) updates.assignee = data.assignee

    await db.update(schema.tasks).set(updates).where(eq(schema.tasks.id, id))
    const updated = await db.select().from(schema.tasks).where(eq(schema.tasks.id, id)).get()

    broadcast({ type: 'task-updated', projectId: existing.projectId, task: updated })
    return updated
}

export const deleteTask = async (id: string) => {
    const existing = await db.select().from(schema.tasks).where(eq(schema.tasks.id, id)).get()
    if (!existing) return false

    await db.delete(schema.tasks).where(eq(schema.tasks.parentId, id))
    await db.delete(schema.tasks).where(eq(schema.tasks.id, id))

    broadcast({ type: 'task-deleted', projectId: existing.projectId, taskId: id })
    return true
}
