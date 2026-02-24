import { z } from 'zod'
import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'
import { now } from '~~/server/utils/helpers'

export default defineMcpTool({
    name: 'move_task',
    description: 'Move a task from one pipeline to another. This is a convenience tool that updates the task\'s pipeline assignment.',
    inputSchema: {
        taskId: z.string().describe('The ID of the task to move'),
        targetPipelineId: z.string().describe('The ID of the pipeline to move the task to'),
    },
    handler: async ({ taskId, targetPipelineId }) => {
        const task = await db.select().from(schema.tasks).where(eq(schema.tasks.id, taskId)).get()
        if (!task) {
            return { content: [{ type: 'text', text: `Error: Task "${taskId}" not found` }] }
        }

        const pipeline = await db.select().from(schema.pipelines).where(eq(schema.pipelines.id, targetPipelineId)).get()
        if (!pipeline) {
            return { content: [{ type: 'text', text: `Error: Pipeline "${targetPipelineId}" not found` }] }
        }

        const updated = await updateTask(taskId, { pipelineId: targetPipelineId })

        if (!updated) {
            return { content: [{ type: 'text', text: `Error: Task "${taskId}" not found` }] }
        }

        return {
            content: [{ type: 'text', text: `Task "${task.title}" moved to pipeline "${pipeline.name}".\n\n${JSON.stringify(updated, null, 2)}` }],
        }
    },
})
