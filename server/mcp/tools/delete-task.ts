import { z } from 'zod'
import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineMcpTool({
    name: 'delete_task',
    description: 'Delete a task and all its subtasks. This action is irreversible.',
    inputSchema: {
        taskId: z.string().describe('The ID of the task to delete'),
    },
    handler: async ({ taskId }) => {
        const success = await deleteTask(taskId)

        if (!success) {
            throw new Error('Task not found')
        }

        return {
            content: [{ type: 'text', text: `Task "${taskId}" and its subtasks deleted successfully.` }],
        }
    },
})
