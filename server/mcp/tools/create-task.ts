import { z } from 'zod'
import { db, schema } from '~~/server/db'
import { generateId, now } from '~~/server/utils/helpers'

export default defineMcpTool({
    name: 'create_task',
    description: 'Create a new task in a specific pipeline. Tasks can optionally have a parent task (for subtasks).',
    inputSchema: {
        projectId: z.string().describe('The ID of the project'),
        pipelineId: z.string().describe('The ID of the pipeline to add the task to'),
        title: z.string().describe('Title of the task'),
        description: z.string().optional().describe('Detailed description of the task'),
        priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().describe('Task priority level'),
        parentId: z.string().optional().describe('Parent task ID if this is a subtask'),
        assignee: z.string().optional().describe('The assignee of the task'),
    },
    handler: async ({ projectId, pipelineId, title, description, priority, parentId, assignee }) => {
        const task = await createTask({
            projectId,
            pipelineId,
            title,
            description,
            priority,
            assignee,
            parentId,
        })

        return {
            content: [{ type: 'text', text: JSON.stringify(task, null, 2) }],
        }
    },
})
