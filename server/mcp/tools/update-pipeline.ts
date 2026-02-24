import { z } from 'zod'
import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineMcpTool({
    name: 'update_pipeline',
    description: 'Update a pipeline\'s name, color, or order.',
    inputSchema: {
        pipelineId: z.string().describe('The ID of the pipeline to update'),
        name: z.string().optional().describe('New name for the pipeline'),
        color: z.string().optional().describe('New hex color'),
        order: z.number().optional().describe('New order position'),
    },
    handler: async ({ pipelineId, name, color, order }) => {
        const updated = await updatePipeline(pipelineId, {
            name,
            color,
            order,
        })

        if (!updated) {
            throw new Error('Pipeline not found')
        }

        return {
            content: [{ type: 'text', text: JSON.stringify(updated, null, 2) }],
        }
    },
})
