import { db, schema } from '~~/server/db'
import { generateId, now } from '~~/server/utils/helpers'
import { eq } from 'drizzle-orm'

export const createProject = async (data: { name: string; description?: string; color?: string }) => {
    const timestamp = now()
    const project = {
        id: generateId(),
        name: data.name,
        description: data.description || '',
        color: data.color || '#6C63FF',
        createdAt: timestamp,
        updatedAt: timestamp,
    }

    await db.insert(schema.projects).values(project)

    // Create default pipelines
    const defaultPipelines = [
        { id: generateId(), projectId: project.id, name: 'To Do', color: '#94A3B8', order: 0 },
        { id: generateId(), projectId: project.id, name: 'In Progress', color: '#3B82F6', order: 1 },
        { id: generateId(), projectId: project.id, name: 'Done', color: '#22C55E', order: 2 },
    ]

    for (const pipeline of defaultPipelines) {
        await db.insert(schema.pipelines).values(pipeline)
    }

    broadcast({ type: 'project-created', project })

    return project
}

export const updateProject = async (id: string, data: { name?: string; description?: string; color?: string }) => {
    const existing = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).get()
    if (!existing) return null

    const updates: Record<string, any> = { updatedAt: now() }
    if (data.name !== undefined) updates.name = data.name
    if (data.description !== undefined) updates.description = data.description
    if (data.color !== undefined) updates.color = data.color

    await db.update(schema.projects).set(updates).where(eq(schema.projects.id, id))
    const updated = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).get()

    broadcast({ type: 'project-updated', projectId: id, project: updated })
    return updated
}

export const deleteProject = async (id: string) => {
    const existing = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).get()
    if (!existing) return false

    // Cascade delete: tasks → pipelines → project
    await db.delete(schema.tasks).where(eq(schema.tasks.projectId, id))
    await db.delete(schema.pipelines).where(eq(schema.pipelines.projectId, id))
    await db.delete(schema.projects).where(eq(schema.projects.id, id))

    broadcast({ type: 'project-deleted', projectId: id })
    return true
}
