import { z } from 'zod'
import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineMcpTool({
    name: 'get_task',
    description: 'Get a task by ID including its subtasks.',
    inputSchema: {
        taskId: z.string().describe('The ID of the task to retrieve'),
    },
    handler: async ({ taskId }) => {
        const task = await db.select().from(schema.tasks).where(eq(schema.tasks.id, taskId)).get()
        if (!task) {
            return { content: [{ type: 'text', text: `Error: Task "${taskId}" not found` }] }
        }

        const subtasks = await db.select().from(schema.tasks).where(eq(schema.tasks.parentId, taskId)).orderBy(schema.tasks.createdAt)

        return {
            content: [{ type: 'text', text: JSON.stringify({ ...task, subtasks }, null, 2) }],
        }
    },
})
