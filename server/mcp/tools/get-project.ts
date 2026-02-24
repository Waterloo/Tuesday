import { z } from 'zod'
import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineMcpTool({
    name: 'get_project',
    description: 'Get a project by ID with all its pipelines and tasks. Use this to see the full board state of a project.',
    inputSchema: {
        projectId: z.string().describe('The ID of the project to retrieve'),
    },
    handler: async ({ projectId }) => {
        const project = await db.select().from(schema.projects).where(eq(schema.projects.id, projectId)).get()
        if (!project) {
            return { content: [{ type: 'text', text: `Error: Project "${projectId}" not found` }] }
        }

        const projectPipelines = await db.select().from(schema.pipelines).where(eq(schema.pipelines.projectId, projectId)).orderBy(schema.pipelines.order)
        const projectTasks = await db.select().from(schema.tasks).where(eq(schema.tasks.projectId, projectId)).orderBy(schema.tasks.createdAt)

        return {
            content: [{ type: 'text', text: JSON.stringify({ ...project, pipelines: projectPipelines, tasks: projectTasks }, null, 2) }],
        }
    },
})
