import { z } from 'zod'
import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'
import { now } from '~~/server/utils/helpers'

export default defineMcpTool({
    name: 'update_task',
    description: 'Update a task\'s title, description, priority, due date, pipeline (to move it), or parent task.',
    inputSchema: {
        taskId: z.string().describe('The ID of the task to update'),
        title: z.string().optional().describe('New title'),
        description: z.string().optional().describe('New description'),
        priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().describe('New priority'),
        pipelineId: z.string().optional().describe('New pipeline ID to move the task to'),
        parentId: z.string().optional().describe('New parent task ID, or empty string to make it a root task'),
        assignee: z.string().optional().describe('New assignee'),
    },
    handler: async ({ taskId, title, description, priority, pipelineId, parentId, assignee }) => {
        const updated = await updateTask(taskId, {
            title,
            description,
            priority,
            pipelineId,
            parentId,
            assignee,
        })

        if (!updated) {
            throw new Error('Task not found')
        }

        return {
            content: [{ type: 'text', text: JSON.stringify(updated, null, 2) }],
        }
    },
})
